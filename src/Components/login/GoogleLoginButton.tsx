import React, { useEffect, useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { GOOGLE_CLIENT_ID, LOGIN_ERROR_MESSAGES } from '../../constants/login.constants';
import { loginWithGoogle } from '../../services/loginApi';
import { GoogleLoginButtonProps } from '../../types/login.types';

declare global {
  interface Window {
    google?: any;
  }
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onGoogleSuccess,
  onError,
  disabled = false,
}) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    const existingScript = document.getElementById('google-client-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-client-script';
      script.onload = () => setGoogleLoaded(true);
      script.onerror = () => onError(LOGIN_ERROR_MESSAGES.googleInitFailed);
      document.body.appendChild(script);
    } else {
      setGoogleLoaded(true);
    }
  }, [onError]);

  const handleGoogleLogin = () => {
    if (!googleLoaded) {
      onError(LOGIN_ERROR_MESSAGES.googleNotLoaded);
      return;
    }

    if (!window.google) {
      onError(LOGIN_ERROR_MESSAGES.googleNotAvailable);
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        ux_mode: 'popup',
      });

      window.google.accounts.id.prompt();
    } catch (err) {
      console.error('Google login init error:', err);
      onError(LOGIN_ERROR_MESSAGES.googleInitFailed);
    }
  };

  const handleGoogleCallback = async (response: any) => {
    try {
      const data = await loginWithGoogle(response.credential);
      onGoogleSuccess(data);
    } catch (err: any) {
      console.error('Google auth error:', err);
      onError(err.message || 'Google authentication failed');
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled || !googleLoaded}
      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2 mb-3 disabled:opacity-50 shadow-sm"
    >
      <FcGoogle size={24} />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
