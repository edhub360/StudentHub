import { LOGIN_API_BASE_URL } from '../constants/login.constants';
import { LoginFormValues, LoginResponse } from '../types/login.types';

export async function loginWithEmail(
  values: LoginFormValues
): Promise<LoginResponse> {
  const response = await fetch(`${LOGIN_API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Login failed');
  }

  const data = (await response.json()) as LoginResponse;
  return data;
}

export async function loginWithGoogle(
  googleToken: string
): Promise<LoginResponse> {
  const response = await fetch(`${LOGIN_API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: googleToken }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Google authentication failed');
  }

  const data = (await response.json()) as LoginResponse;
  return data;
}

export async function refreshToken(
  refreshToken: string
): Promise<LoginResponse> {
  const response = await fetch(`${LOGIN_API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data = (await response.json()) as LoginResponse;
  return data;
}

export async function logout(accessToken: string): Promise<void> {
  // Get refresh token from localStorage before clearing
  const refreshTokenValue =
    localStorage.getItem('refresh_token') ||
    localStorage.getItem('refreshToken') ||
    '';

  await fetch(`${LOGIN_API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    // Send refresh_token in body so backend can revoke it
    body: JSON.stringify({ refresh_token: refreshTokenValue }),
  });
}

export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${LOGIN_API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to process forgot password request');
  }
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(`${LOGIN_API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      new_password: newPassword,
    }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to reset password');
  }
}
