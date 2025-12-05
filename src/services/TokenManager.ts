// src/services/TokenManager.ts

import { refreshToken } from './loginApi';
import type { LoginResponse } from '../types/login.types';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export function getStoredTokens() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
  return { accessToken, refreshToken: refreshTokenValue };
}

export function setTokens(data: LoginResponse) {
  // call this right after successful login / refresh
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// --- helpers ---

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
    return expMs <= Date.now() + skewMs; // treat "about to expire" as expired
  } catch {
    return true;
  }
}

/**
 * Returns a valid access token.
 * If current one is missing OR expired, tries to refresh using refresh_token.
 * On refresh failure, clears tokens and throws so caller can redirect to login.
 */
export async function getValidAccessToken(): Promise<string> {
  let { accessToken, refreshToken: storedRefresh } = getStoredTokens();

  // If we have a token and it is still valid, just use it
  if (accessToken && !isTokenExpired(accessToken)) {
    return accessToken;
  }

  // Otherwise try to refresh
  if (!storedRefresh) {
    clearTokens();
    throw new Error('No refresh token available');
  }

  try {
    const refreshed = await refreshToken(storedRefresh);
    setTokens(refreshed);
    return refreshed.access_token;
  } catch (err) {
    clearTokens();
    throw new Error('Session expired. Please sign in again.');
  }
}
