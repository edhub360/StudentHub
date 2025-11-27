export const LOGIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GOOGLE_CLIENT_ID = '91248372939-g3jbh33msjjdbd3drp84lvaioukm9c3l.apps.googleusercontent.com';

export const LOGIN_ERROR_MESSAGES = {
  missingCredentials: 'Please enter email and password',
  generic: 'Login failed. Please check your credentials.',
  googleNotLoaded: 'Google Sign-In not loaded yet. Refresh the page.',
  googleNotAvailable: 'Google Sign-In not available.',
  googleInitFailed: 'Failed to initialize Google Sign-In',
};

export const LOGIN_SUCCESS_MESSAGES = {
  loginSuccessful: 'Login successful! Redirecting...',
};
