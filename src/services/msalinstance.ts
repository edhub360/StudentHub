// src/services/msalInstance.ts
import { PublicClientApplication } from '@azure/msal-browser';
import { MICROSOFT_CLIENT_ID } from '../constants/login.constants';

export const MICROSOFT_REDIRECT_URI = `${window.location.origin}/auth/microsoft`;

export const msalInstance = new PublicClientApplication({
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: MICROSOFT_REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
});
