import React, { useCallback, useEffect, useRef } from 'react';
import { PublicClientApplication, PopupRequest } from '@azure/msal-browser';
import { FaMicrosoft } from 'react-icons/fa';
import { MICROSOFT_CLIENT_ID } from '../../constants/login.constants';
import { loginWithMicrosoft } from '../../services/loginApi';
import { MicrosoftLoginButtonProps } from '../../types/login.types';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId: MICROSOFT_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
});

const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

const MicrosoftLoginButton: React.FC<MicrosoftLoginButtonProps> = ({
  onMicrosoftSuccess,
  onError,
  disabled = false,
}) => {
  const initializedRef = useRef(false);

  // Initialize MSAL once on mount — not on every click
  useEffect(() => {
    const initMsal = async () => {
      if (initializedRef.current) return;
      await msalInstance.initialize();
      initializedRef.current = true;
    };
    initMsal();
  }, []);

  const handleMicrosoftLogin = useCallback(async () => {
    try {
      const response = await msalInstance.loginPopup(loginRequest);
      const data = await loginWithMicrosoft(response.accessToken);
      onMicrosoftSuccess(data);
    } catch (error: any) {
      // Silently ignore — user closed popup or nested popup blocked
      if (
        error?.errorCode === 'user_cancelled' ||
        error?.errorCode === 'timed_out' ||
        error?.errorCode === 'block_nested_popups' ||
        error?.message?.includes('timed_out') ||
        error?.message?.includes('user_cancelled')
      ) {
        return;
      }
      onError(error?.message || 'Microsoft login failed');
    }
  }, [onMicrosoftSuccess, onError]);

  return (
    <button
      type="button"
      onClick={handleMicrosoftLogin}
      disabled={disabled}
      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2 mb-3 disabled:opacity-50 shadow-sm"
    >
      <FaMicrosoft size={20} color="#00a4ef" />
      Login with Microsoft
    </button>
  );
};

export default MicrosoftLoginButton;
