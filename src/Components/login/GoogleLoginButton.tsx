import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [googleReady, setGoogleReady] = useState(false);
  const tokenClientRef = useRef<any>(null);

  // Keep callbacks in a ref so the token client callback never goes stale
  const callbacksRef = useRef({ onGoogleSuccess, onError });
  useEffect(() => {
    callbacksRef.current = { onGoogleSuccess, onError };
  });

  const initTokenClient = useCallback(() => {
    if (!window.google?.accounts?.oauth2) return false;
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'email profile',
      callback: async (tokenResponse: any) => {
        if (
          tokenResponse.error === 'access_denied' ||
          tokenResponse.error === 'popup_closed_by_user'
        ) return;
        if (tokenResponse.error) {
          callbacksRef.current.onError(LOGIN_ERROR_MESSAGES.googleInitFailed);
          return;
        }
        try {
          const data = await loginWithGoogle(tokenResponse.access_token);
          callbacksRef.current.onGoogleSuccess(data);
        } catch (err: any) {
          callbacksRef.current.onError(err.message || 'Google authentication failed');
        }
      },
    });
    return true;
  }, []);

  useEffect(() => {
    let pollInterval: ReturnType<typeof setInterval>;

    const onScriptReady = () => {
      // Poll until window.google.accounts.oauth2 is available (usually immediate)
      pollInterval = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          clearInterval(pollInterval);
          initTokenClient();
          setGoogleReady(true);
        }
      }, 50);
    };

    const existingScript = document.getElementById('google-client-script');
    if (existingScript) {
      // Script tag exists — google may already be loaded or still loading
      if (window.google?.accounts?.oauth2) {
        initTokenClient();
        setGoogleReady(true);
      } else {
        onScriptReady();
      }
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-client-script';
      script.onload = onScriptReady;
      script.onerror = () => callbacksRef.current.onError(LOGIN_ERROR_MESSAGES.googleInitFailed);
      document.body.appendChild(script);
    }

    return () => clearInterval(pollInterval);
  }, [initTokenClient]);

  const handleGoogleLogin = () => {
    // Lazy-init in case the poll missed (edge case)
    if (!tokenClientRef.current) {
      initTokenClient();
    }
    if (!googleReady || !tokenClientRef.current) {
      onError(LOGIN_ERROR_MESSAGES.googleNotLoaded);
      return;
    }
    tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={disabled || !googleReady}
      className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2 mb-3 disabled:opacity-50 shadow-sm"
    >
      <FcGoogle size={24} />
      Login with Google
    </button>
  );
};

export default GoogleLoginButton;
