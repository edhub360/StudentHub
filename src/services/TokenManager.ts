// src/services/tokenManager.ts
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

/**
 * Returns a valid access token.
 * If the current one is missing or rejected, tries to refresh using refresh_token.
 * On refresh failure, clears tokens and throws an error so caller can redirect to login.
 */
export async function getValidAccessToken(): Promise<string> {
  let { accessToken, refreshToken: storedRefresh } = getStoredTokens();

  if (accessToken) {
    return accessToken;
  }

  if (!storedRefresh) {
    throw new Error('No refresh token available');
  }

  const refreshed = await refreshToken(storedRefresh);
  setTokens(refreshed);
  return refreshed.access_token;
}
