import React, { useState, useEffect } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Logo from '../images/logo.edhub.png';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
  onSwitchToRegister: () => void;
  onLoginSuccess?: (token: string, userId: string, hasSubscription: boolean) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000';
const GOOGLE_CLIENT_ID = '91248372939-g3jbh33msjjdbd3drp84lvaioukm9c3l.apps.googleusercontent.com';

declare global {
  interface Window {
    google?: any;
  }
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn, onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // 1️⃣ Load Google script safely
  useEffect(() => {
    const existingScript = document.getElementById('google-client-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'google-client-script';
      script.onload = () => setGoogleLoaded(true);
      script.onerror = () => setError('Failed to load Google Sign-In script');
      document.body.appendChild(script);
    } else {
      setGoogleLoaded(true);
    }
  }, []);

  // 2️⃣ Save user data to localStorage and update state
  const saveUserData = (data: any) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user_id', data.user.user_id);
    localStorage.setItem('userEmail', data.user.email);
    localStorage.setItem('userName', data.user.name || '');
    setIsLoggedIn(true);

    if (onLoginSuccess) {
      onLoginSuccess(
        data.access_token,
        data.user.user_id,
        data.user.has_active_subscription
      );
    }
  };

  // 3️⃣ Normal email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Login failed');
      }

      const data = await response.json();
      saveUserData(data);

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // 4️⃣ Google login
  const handleGoogleLogin = () => {
    if (!googleLoaded) {
      setError('Google Sign-In not loaded yet. Refresh the page.');
      return;
    }

    if (!window.google) {
      setError('Google Sign-In not available.');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        ux_mode: 'popup', // ⚡ important to avoid FedCM / iframe issues
      });

      window.google.accounts.id.prompt(); // show login popup
    } catch (err) {
      console.error('Google login init error:', err);
      setError('Failed to initialize Google Sign-In');
    }
  };

  const handleGoogleCallback = async (response: any) => {
    console.log('[GoogleCallback] Response:', response);
    setLoading(true);
    setError('');

    try {
      const apiResponse = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.credential }),
      });

      if (!apiResponse.ok) {
        const data = await apiResponse.json();
        throw new Error(data.detail || 'Google authentication failed');
      }

      const data = await apiResponse.json();
      saveUserData(data);

    } catch (err: any) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = () => {
    setError('Facebook login coming soon!');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="EdHub Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Welcome Back!</h2>
        <p className="text-center text-gray-500 mb-6">Login to continue your journey</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !loading && handleLogin()}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or continue with</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading || !googleLoaded}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition flex items-center justify-center gap-2 mb-3 disabled:opacity-50 shadow-sm"
        >
          <FcGoogle size={24} />
          Login with Google
        </button>

        <button
          onClick={handleFacebookLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <FaFacebook size={24} />
          Login with Facebook
        </button>

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
      </div>
    </div>
  );
};


export default Login;
