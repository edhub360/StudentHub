import React, { useEffect, useState, useRef } from 'react';
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
  const tokenClientRef = useRef<any>(null); // persist oauth2 client across renders

  // Step 1: Load Google GSI script
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
  }, []);

  // Step 2: Initialize OAuth2 token client ONCE after script loads
  useEffect(() => {
    if (!googleLoaded || !window.google?.accounts?.oauth2) return;

    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse: any) => {
        if (tokenResponse.error) {
          console.error('Google OAuth2 error:', tokenResponse.error);
          onError(LOGIN_ERROR_MESSAGES.googleInitFailed);
          return;
        }
        try {
          const data = await loginWithGoogle(tokenResponse.access_token);
          onGoogleSuccess(data);
        } catch (err: any) {
          console.error('Google auth error:', err);
          onError(err.message || 'Google authentication failed');
        }
      },
    });
  }, [googleLoaded]); // runs only once after script is ready

  // Step 3: Trigger OAuth2 popup on button click
  const handleGoogleLogin = () => {
    if (!googleLoaded || !tokenClientRef.current) {
      onError(LOGIN_ERROR_MESSAGES.googleNotLoaded);
      return;
    }
    // 'select_account' forces account picker — works in incognito
    tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
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
