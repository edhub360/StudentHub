import React, { useState } from 'react';
import { LoginFormValues } from '../../types/login.types';

interface LoginFormProps {
  loading: boolean;
  onSubmit: (values: LoginFormValues) => Promise<void> | void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ loading, onSubmit, onForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
        required
      />

      {onForgotPassword && (
        <div className="text-right mb-4">
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={loading}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition disabled:opacity-50"
          >
            Forgot password?
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-sm"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
