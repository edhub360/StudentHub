import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import Logo from '../images/logo.edhub.png';

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Normal email/password login
  const handleLogin = () => {
    if (email === 'alex@gmail.com' && password === '123456') {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
    } else {
      setError('Invalid email or password');
    }
  };

  // Google login
  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // TODO: Add Google OAuth logic here
  };

  // Facebook login
  const handleFacebookLogin = () => {
    console.log('Facebook login clicked');
    // TODO: Add Facebook OAuth logic here
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl w-96 p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
            <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500 mt-1">Login to continue your journey</p>
        </div>

        {/* Email/Password Inputs */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-3 mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Social Login Buttons */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 mb-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} />
          <span className="font-medium text-gray-700">Login with Google</span>
        </button>

        <button
          onClick={handleFacebookLogin}
          className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-lg hover:bg-[#166fe5] transition"
        >
          <FaFacebook size={22} />
          <span className="font-medium">Login with Facebook</span>
        </button>
      </div>
    </div>
  );
};

export default Login;
