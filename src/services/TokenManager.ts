// src/services/TokenManager.ts

// src/services/TokenManager.ts

import { refreshToken } from './loginApi';
import type { LoginResponse } from '../types/login.types';

// Primary keys (what TokenManager writes)
const ACCESS_TOKEN_KEY  = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Legacy keys (what rest of the app uses)
const LEGACY_ACCESS_TOKEN_KEY  = 'token';
const LEGACY_REFRESH_TOKEN_KEY = 'refreshToken';

// ─── Read: check both keys ────────────────────────────────────────────────────
export function getStoredTokens() {
  // Try primary key first, fall back to legacy key
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

// ─── Write: save under BOTH keys so all services stay in sync ─────────────────
export function setTokens(data: LoginResponse) {
  // Write to both keys so nothing breaks
  localStorage.setItem(ACCESS_TOKEN_KEY,  data.access_token);   // new key
  localStorage.setItem(LEGACY_ACCESS_TOKEN_KEY, data.access_token); // 'token'

  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY,  data.refresh_token);   // new key
    localStorage.setItem(LEGACY_REFRESH_TOKEN_KEY, data.refresh_token); // 'refreshToken'
  }
}

// ─── Clear: remove ALL keys ───────────────────────────────────────────────────
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_REFRESH_TOKEN_KEY);
}

// ─── helpers (unchanged) ──────────────────────────────────────────────────────
function isTokenExpired(token: string, skewMs = 30_000): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const payloadJson = atob(
      parts[1].replace(/-/g, '+').replace(/_/g, '/')
    );
    const payload = JSON.parse(payloadJson);
    if (!payload.exp) return true;

    const expMs = payload.exp * 1000;
    return expMs <= Date.now() + skewMs;
  } catch {
    return true;
  }
}

export async function getValidAccessToken(): Promise<string> {
  let { accessToken, refreshToken: storedRefresh } = getStoredTokens();

  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  if (!storedRefresh) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const refreshed = await refreshToken(storedRefresh);
    setTokens(refreshed); // ✅ saves to ALL 4 keys
    return refreshed.access_token;
  } catch (err) {
    clearTokens();
    throw new Error('Session expired. Please sign in again.');
  }
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

