  // import React, { useState } from 'react';
  // import axios from 'axios';
  // import { FcGoogle } from 'react-icons/fc';
  // import { FaFacebook } from 'react-icons/fa';
  // import Logo from '../images/logo.edhub.png';

  // interface LoginProps {
  //   setIsLoggedIn: (value: boolean) => void;
  // }

  // interface LoginResponse {
  //   access_token: string;
  //   refresh_token: string;
  //   token_type: string;
  //   user: {   
  //     email: string;
  //     name: string;
  //     user_id: string;
  //   };
  // }

  // const Login: React.FC<LoginProps> = ({ setIsLoggedIn }) => {
  //   const [email, setEmail] = useState('');
  //   const [password, setPassword] = useState('');
  //   const [error, setError] = useState('');
  //   const [loading, setLoading] = useState(false);

  //   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  //   // Email/Password login with backend
  //   const handleLogin = async () => {
  //     if (!email || !password) {
  //       setError('Please enter email and password');
  //       return;
  //     }

  //     setError('');
  //     setLoading(true);

  //     try {
  //       const response = await axios.post<LoginResponse>(
  //         `${API_BASE_URL}/auth/login`,
  //         { email, password }
  //       );

  //       const { access_token, refresh_token, user } = response.data;

  //       localStorage.setItem('access_token', access_token);
  //       localStorage.setItem('refresh_token', refresh_token);
  //       localStorage.setItem('user', JSON.stringify(user));
  //       localStorage.setItem('isLoggedIn', 'true');

  //       setIsLoggedIn(true);
  //     } catch (err: any) {
  //       if (err.response) {
  //         setError(err.response.data?.detail || 'Invalid email or password');
  //       } else if (err.request) {
  //         setError('Cannot connect to server');
  //       } else {
  //         setError('Login failed');
  //       }
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   // Google login - placeholder for now
  //   const handleGoogleLogin = () => {
  //     console.log('Google login clicked - Coming soon!');
  //     setError('Google login coming soon. Please use email/password for now.');
  //   };

  //   // Facebook login - placeholder for now
  //   const handleFacebookLogin = () => {
  //     console.log('Facebook login clicked - Coming soon!');
  //     setError('Facebook login coming soon. Please use email/password for now.');
  //   };

  //   return (
  //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
  //       <div className="bg-white rounded-2xl shadow-xl w-96 p-8">
  //         {/* Header */}
  //         <div className="text-center mb-6">
  //           <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
  //             <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
  //           </div>
  //           <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
  //           <p className="text-gray-500 mt-1">Login to continue your journey</p>
  //         </div>

  //         {/* Email/Password Inputs */}
  //         <input
  //           type="email"
  //           placeholder="Email"
  //           value={email}
  //           onChange={e => setEmail(e.target.value)}
  //           disabled={loading}
  //           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
  //         />
  //         <input
  //           type="password"
  //           placeholder="Password"
  //           value={password}
  //           onChange={e => setPassword(e.target.value)}
  //           onKeyPress={e => e.key === 'Enter' && !loading && handleLogin()}
  //           disabled={loading}
  //           className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
  //         />

  //         {error && (
  //           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
  //             <p className="text-red-600 text-sm text-center">{error}</p>
  //           </div>
  //         )}

  //         {/* Login Button */}
  //         <button
  //           onClick={handleLogin}
  //           disabled={loading}
  //           className="w-full py-3 mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  //         >
  //           {loading ? 'Logging in...' : 'Login'}
  //         </button>

  //         {/* Divider */}
  //         <div className="flex items-center my-4">
  //           <div className="flex-grow border-t border-gray-300"></div>
  //           <span className="mx-3 text-gray-500 text-sm">or</span>
  //           <div className="flex-grow border-t border-gray-300"></div>
  //         </div>

  //         {/* Social Login Buttons */}
  //         <button
  //           onClick={handleGoogleLogin}
  //           className="w-full flex items-center justify-center gap-3 mb-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
  //         >
  //           <FcGoogle size={22} />
  //           <span className="font-medium text-gray-700">Login with Google</span>
  //         </button>

  //         <button
  //           onClick={handleFacebookLogin}
  //           className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-lg hover:bg-[#166fe5] transition"
  //         >
  //           <FaFacebook size={22} />
  //           <span className="font-medium">Login with Facebook</span>
  //         </button>
  //       </div>
  //     </div>
  //   );
  // };

  // export default Login;
  import React, { useState } from 'react';
  import axios from 'axios';
  import { FcGoogle } from 'react-icons/fc';
  import { FaFacebook } from 'react-icons/fa';
  import Logo from '../images/logo.edhub.png';

  interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
    onSwitchToRegister: () => void;
  }

  interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
    user: {
      email: string;
      name: string;
      user_id: string;
    };
  }

  const Login: React.FC<LoginProps> = ({ setIsLoggedIn, onSwitchToRegister }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

    // const handleLogin = async () => {
    //   if (!email || !password) {
    //     setError('Please enter email and password');
    //     return;
    //   }

    //   setError('');
    //   setLoading(true);

    //   try {
    //     const response = await axios.post<LoginResponse>(
    //       `${API_BASE_URL}/auth/login`,
    //       { email, password }
    //     );

    //     const { access_token, refresh_token, user } = response.data;

    //     localStorage.setItem('access_token', access_token);
    //     localStorage.setItem('refresh_token', refresh_token);
    //     localStorage.setItem('user', JSON.stringify(user));
    //     localStorage.setItem('isLoggedIn', 'true');

    //     setIsLoggedIn(true);
    //   } catch (err: any) {
    //     if (err.response) {
    //       setError(err.response.data?.detail || 'Invalid email or password');
    //     } else if (err.request) {
    //       setError('Cannot connect to server');
    //     } else {
    //       setError('Login failed');
    //     }
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    
const handleLogin = () => {
  // Basic validation
  if (!email || !password) {
    setError('Please enter email and password');
    return;
  }

  setError('');
  setLoading(true);

  // Static login - no backend call
  setTimeout(() => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    setLoading(false);
  }, 500);
};


    const handleGoogleLogin = () => {
      alert('Google login coming soon!');
    };

    const handleFacebookLogin = () => {
      alert('Facebook login coming soon!');
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-2xl shadow-xl w-96 p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-4">
              <img src={Logo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
            <p className="text-gray-500 mt-1">Login to continue your journey</p>
          </div>

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
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !loading && handleLogin()}
            disabled={loading}
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          />

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 mb-4 bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 mb-3 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-gray-700">Login with Google</span>
          </button>

          <button
            onClick={handleFacebookLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white py-3 rounded-lg hover:bg-[#166fe5] transition mb-4"
          >
            <FaFacebook size={22} />
            <span className="font-medium">Login with Facebook</span>
          </button>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-blue-500 hover:underline font-semibold"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  };

  export default Login;

