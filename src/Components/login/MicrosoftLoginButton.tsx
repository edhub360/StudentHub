import React, { useCallback } from 'react';
import { PopupRequest } from '@azure/msal-browser';
import { FaMicrosoft } from 'react-icons/fa';
import { MicrosoftLoginButtonProps } from '../../types/login.types';
import { msalInstance, msalReady } from '../../services/msalinstance';
import { loginWithMicrosoft } from '../../services/loginApi';

const loginRequest: PopupRequest = {
  scopes: ['User.Read', 'openid', 'profile', 'email'],
};

const MicrosoftLoginButton: React.FC<MicrosoftLoginButtonProps> = ({
  onMicrosoftSuccess,
  onError,
  disabled = false,
}) => {
  const handleMicrosoftLogin = useCallback(async () => {
    try {
      await msalReady;
      console.log('🔵 Starting Microsoft login popup...');
      
      const response = await msalInstance.loginPopup({
        ...loginRequest,
        prompt: 'select_account',
        redirectUri: `${window.location.origin}/auth-redirect.html`,
      });
      
      console.log('🟢 Popup success, accessToken:', response.accessToken ? 'EXISTS' : 'MISSING');
      
      const data = await loginWithMicrosoft(response.accessToken);
      console.log('🟢 Backend success:', data);
      onMicrosoftSuccess(data);
      
    } catch (error: any) {
      console.log('🔴 Error:', error?.errorCode, error?.message);
      if (
        error?.errorCode === 'user_cancelled' ||
        error?.errorCode === 'timed_out' ||
        error?.message?.includes('user_cancelled')
      ) return;
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