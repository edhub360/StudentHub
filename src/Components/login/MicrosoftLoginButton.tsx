import React, { useCallback } from 'react';
import { PopupRequest } from '@azure/msal-browser';
import { FaMicrosoft } from 'react-icons/fa';
import { MicrosoftLoginButtonProps } from '../../types/login.types';
import { msalInstance, MICROSOFT_REDIRECT_URI, msalReady } from '../../services/msalinstance';

const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

const MicrosoftLoginButton: React.FC<MicrosoftLoginButtonProps> = ({
  onError,
  disabled = false,
}) => {
  const handleMicrosoftLogin = useCallback(async () => {
    try {
      await msalReady;
      await msalInstance.loginRedirect({
        ...loginRequest,
        prompt: 'select_account',
        redirectUri: MICROSOFT_REDIRECT_URI,
      });
    } catch (error: any) {
      onError(error?.message || 'Microsoft login failed');
    }
  }, [onError]);

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