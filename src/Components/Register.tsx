import React, { useState } from 'react';
import Logo from '../images/logo.edhub.png';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (token: string, userId: string, hasSubscription: boolean) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const data = await response.json();

      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('subscription_tier', data.user.subscription_tier || '');
      localStorage.setItem('user_id', data.user.user_id);
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userName', data.user.name || '');

      setSuccess('Account created successfully! Redirecting...');

      const hasSubscription = !!data.user.subscription_tier;

      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(
            data.access_token,
            data.user.user_id,
            hasSubscription
          );
        }
      }, 1000);

    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md border border-gray-200">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="EdHub Logo" className="h-16 w-auto" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Sign up to get started</p>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

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
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !loading && handleRegister()}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-center text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-center text-sm">
            {success}
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="text-center mt-6 text-gray-600 text-sm">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            disabled={loading}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
