import React, { useState } from 'react';
import Logo from '../images/logo.edhub.png';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess?: (token: string, userId: string) => void;  // ← ADD THIS
}

const Register: React.FC<RegisterProps> = ({ onSwitchToLogin, onRegisterSuccess }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
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

    // ✅ DEMO MODE: Fake registration
    setTimeout(() => {
      // Generate fake credentials
      const fakeToken = 'demo_token_' + Date.now();
      const fakeUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      
      // Save to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', fakeToken);
      localStorage.setItem('user_id', fakeUserId);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      
      setSuccess('Account created successfully! Redirecting...');
      
      // ✅ Call callback - triggers subscription page
      setTimeout(() => {
        if (onRegisterSuccess) {
          onRegisterSuccess(fakeToken, fakeUserId);
        }
      }, 1000);
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-8">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-1">Sign up to get started</p>
        </div>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !loading && handleRegister()}
          disabled={loading}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
        />

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-600 text-sm text-center">{success}</p>
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3 mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <div className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-500 hover:underline font-semibold"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
