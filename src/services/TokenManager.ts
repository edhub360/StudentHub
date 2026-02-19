// src/services/TokenManager.ts

import { refreshToken } from './loginApi';
import type { LoginResponse } from '../types/login.types';

const ACCESS_TOKEN_KEY         = 'access_token';
const REFRESH_TOKEN_KEY        = 'refresh_token';
const LEGACY_ACCESS_TOKEN_KEY  = 'token';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';

// ✅ Refresh lock - prevents simultaneous refresh calls
let refreshPromise: Promise<string> | null = null;

export function getStoredTokens() {
  const accessToken =
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_ACCESS_TOKEN_KEY) ||
    null;

  const refreshTokenValue =
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    localStorage.getItem(LEGACY_REFRESH_TOKEN_KEY) ||
    null;

  return { accessToken, refreshToken: refreshTokenValue };
}

export function setTokens(data: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY,         data.access_token);
  localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY,  data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY,        data.refresh_token);
    localStorage.setItem(LEGACY_REFRESH_TOKEN_KEY, data.refresh_token);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

function isTokenExpired(token: string, skewMs = 30_000): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadJson = atob(
      parts[1].replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return true;

    return payload.exp * 1000 <= Date.now() + skewMs;
  } catch {
    return true;
  }
}

// ✅ Single refresh execution - all concurrent callers wait for same promise
async function doRefresh(storedRefresh: string): Promise<string> {
  try {
    const refreshed = await refreshToken(storedRefresh);
    setTokens(refreshed);
    return refreshed.access_token;
  } catch (err) {
    clearTokens();
    throw new Error('Session expired. Please sign in again.');
  } finally {
    refreshPromise = null; // ✅ always release lock
  }
}

export async function getValidAccessToken(): Promise<string> {
  const { accessToken, refreshToken: storedRefresh } = getStoredTokens();

  // Token still valid — return immediately
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  // No refresh token — force logout
  if (!storedRefresh) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  // ✅ If refresh already in-flight, wait for it instead of firing a second one
  if (refreshPromise) {
    return refreshPromise;
  }

  // Start refresh and lock
  refreshPromise = doRefresh(storedRefresh);
  return refreshPromise;
}

export function getUserId(): string | null {
  const { accessToken } = getStoredTokens();
  if (!accessToken) return null;

  try {
    const parts = accessToken.split('.');
    if (parts.length !== 3) return null;

    const payloadJson = atob(
      parts[1].replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadJson);
    return payload.user_id || payload.sub || null;
  } catch {
    return null;
  }
}
