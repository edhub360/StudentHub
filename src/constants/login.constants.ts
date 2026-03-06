export const LOGIN_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GOOGLE_CLIENT_ID = '91248372939-g3jbh33msjjdbd3drp84lvaioukm9c3l.apps.googleusercontent.com';

export const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID || '11fad16e-2c09-4d98-bdc5-e6eed5d204e8';

export const FACEBOOK_APP_ID = '1124729383084842';

export const LOGIN_ERROR_MESSAGES = {
  missingCredentials: 'Please enter email and password',
  generic: 'Login failed. Please check your credentials.',
  googleNotLoaded: 'Google Sign-In not loaded yet. Refresh the page.',
  googleNotAvailable: 'Google Sign-In not available.',
  googleInitFailed: 'Failed to initialize Google Sign-In',
  facebookInitFailed: 'Facebook login could not be initialized. Please refresh.',
  facebookNotLoaded:  'Facebook login is not ready yet. Please try again.',
};

export const LOGIN_SUCCESS_MESSAGES = {
  loginSuccessful: 'Login successful! Redirecting...',
};
