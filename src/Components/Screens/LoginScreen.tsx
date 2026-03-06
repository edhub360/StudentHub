import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FacebookLoginButton from '../login/FacebookLoginButton';  
import Logo from '../../images/logo.edhub.png';
import LoginForm from '../login/LoginForm';
import GoogleLoginButton from '../login/GoogleLoginButton';
import { setTokens } from '../../services/TokenManager';
import { loginWithEmail } from '../../services/loginApi';
import { LoginScreenProps, LoginResponse, LoginFormValues } from '../../types/login.types';
import { LOGIN_ERROR_MESSAGES } from '../../constants/login.constants';
import MicrosoftLoginButton from '../login/MicrosoftLoginButton';

const LoginScreen: React.FC<LoginScreenProps> = ({
  onLoginSuccess,
  onSwitchToRegister,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const isDevelopment = import.meta.env.MODE === 'development';
  // Show auth_message from forced logout (e.g. another device login)
  useEffect(() => {
    const msg = localStorage.getItem('auth_message');
    if (msg) {
      setError(msg);
      localStorage.removeItem('auth_message'); // clear after showing
    }
  }, []);

  const saveUserData = (data: LoginResponse) => {
    // store tokens via shared helper
    setTokens(data);

    // keep existing localStorage fields for backward compatibility
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('access_token', data.access_token);
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token);
    }
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('subscription_tier', data.user.subscription_tier || '');
    localStorage.setItem('user_id', data.user.user_id);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.name || '');

    const hasSubscription = !!data.user.subscription_tier;

    if (onLoginSuccess) {
      onLoginSuccess(data.access_token, data.user.user_id, hasSubscription);
    }
  };

  const handleEmailLogin = async (values: LoginFormValues) => {
    setError('');
    setLoading(true);

    try {
      const data = await loginWithEmail(values);
      saveUserData(data);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || LOGIN_ERROR_MESSAGES.generic);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (data: LoginResponse) => {
    saveUserData(data);
  };

  const handleGoogleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  // Add alongside GoogleLoginButton
  const handleMicrosoftSuccess = (data: LoginResponse) => {
    saveUserData(data); // reuses exact same saveUserData — no duplication
  };

  const handleMicrosoftError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleFacebookSuccess = (data: LoginResponse) => saveUserData(data); 
  const handleFacebookError = (errorMessage: string) => setError(errorMessage);

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 to-teal-300">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md border border-gray-100">

        {/* Logo + Branding */}
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="EdHub360 Logo" className="h-16 w-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
            Sign in to EdHub360
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your AI-powered learning companion
          </p>
        </div>

        {/* Development only — email login */}
        {isDevelopment && (
          <>
            <LoginForm
              loading={loading}
              onSubmit={handleEmailLogin}
              onForgotPassword={handleForgotPassword}
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center text-sm mt-3">
                {error}
              </div>
            )}
            <div className="flex items-center my-5">
              <hr className="flex-1 border-gray-200" />
              <span className="px-3 text-gray-400 text-xs uppercase tracking-widest">
                or continue with
              </span>
              <hr className="flex-1 border-gray-200" />
            </div>
          </>
        )}

        {/* Production error */}
        {!isDevelopment && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-center text-sm mb-4">
            {error}
          </div>
        )}

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3">
          <GoogleLoginButton
            onGoogleSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            disabled={loading}
          />
          <MicrosoftLoginButton
            onMicrosoftSuccess={handleMicrosoftSuccess}
            onError={handleMicrosoftError}
            disabled={loading}
          />
          <FacebookLoginButton
            onFacebookSuccess={handleFacebookSuccess}
            onError={handleFacebookError}
            disabled={loading}
          />
        </div>

        {/* Privacy note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          By signing in, you agree to our{' '}
          <a href="/terms-of-service" className="underline hover:text-gray-600">Terms</a>
          {' '}and{' '}
          <a href="/privacy-policy" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>

        {/* Sign up — dev only */}
        {onSwitchToRegister && isDevelopment && (
          <p className="text-center mt-4 text-gray-500 text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
              disabled={loading}
            >
              Sign Up
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
export default LoginScreen;
