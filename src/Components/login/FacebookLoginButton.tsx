import React, { useEffect, useState, useRef } from 'react';
import { FaFacebook } from 'react-icons/fa';
import { LOGIN_ERROR_MESSAGES, FACEBOOK_APP_ID } from '../../constants/login.constants';
import { loginWithFacebook } from '../../services/loginApi';
import { FacebookLoginButtonProps } from '../../types/login.types';

declare global {
  interface Window {
    FB?: any;
    fbAsyncInit?: () => void;
  }
}

const FacebookLoginButton: React.FC<FacebookLoginButtonProps> = ({
  onFacebookSuccess,
  onError,
  disabled = false,
}) => {
  const [fbLoaded, setFbLoaded] = useState(false);
  const sdkInitialized = useRef(false);

  // Step 1: Load Facebook SDK script
  useEffect(() => {
    const existingScript = document.getElementById('facebook-jssdk');
    if (!existingScript) {
      window.fbAsyncInit = () => {
        window.FB?.init({
          appId: FACEBOOK_APP_ID,
          cookie: true,
          xfbml: false,
          version: 'v25.0',
        });
        sdkInitialized.current = true;
        setFbLoaded(true);
      };

      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      script.id = 'facebook-jssdk';
      script.onerror = () => onError(LOGIN_ERROR_MESSAGES.facebookInitFailed);
      document.body.appendChild(script);
    } else {
      // Script already loaded (e.g. re-render)
      setFbLoaded(true);
    }
  }, []);

  // Step 2: Trigger Facebook login popup on button click
  const handleFacebookLogin = () => {
    if (!fbLoaded || !window.FB) {
        onError(LOGIN_ERROR_MESSAGES.facebookNotLoaded);
        return;
    }

    // Callback is NOT async — wrap the async work inside
    window.FB.login(
        (response: any) => {
        if (!response.authResponse) {
            onError('Facebook login was cancelled.');
            return;
        }

        // Call async function separately — don't make the callback async
        loginWithFacebook(response.authResponse.accessToken)
            .then((data) => {
            onFacebookSuccess(data);
            })
            .catch((err: any) => {
            console.error('Facebook auth error:', err);
            onError(err.message || 'Facebook authentication failed');
            });
        },
        { scope: 'email,public_profile' }
    );
    };


  return (
    <button
        type="button"
        onClick={handleFacebookLogin}
        disabled={disabled || !fbLoaded}
        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
    >
        <FaFacebook size={24} className="text-blue-600" />
        Login with Facebook
    </button>
 );
};

export default FacebookLoginButton;
