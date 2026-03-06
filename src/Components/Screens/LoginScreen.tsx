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
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="EdHub Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back!</h2>
        <p className="text-center text-gray-500 mb-6">Login to continue your journey</p>

        {/* ← Email/password only in development */}
        {isDevelopment && (
          <>
            <LoginForm
              loading={loading}
              onSubmit={handleEmailLogin}
              onForgotPassword={handleForgotPassword}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center text-sm mt-4">
                {error}
              </div>
            )}
          </>
        )}

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* ← Error shown for social login errors in production too */}
        {!isDevelopment && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

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

        {onSwitchToRegister && isDevelopment && (
          <p className="text-center mt-6 text-gray-600 text-sm">
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
