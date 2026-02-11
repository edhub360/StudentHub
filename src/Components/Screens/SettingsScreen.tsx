// src/Screens/SettingsScreen.tsx 
import { useState, useEffect } from 'react';

export default function SettingsScreen() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || 'Guest User');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [subscription, setSubscription] = useState({ plan: 'Free', status: 'Active', expiry: 'N/A' });

  useEffect(() => {
    // Fetch real subscription data from your FastAPI backend
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/user/subscription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubscription(await res.json());
    } catch (err) {
      console.error('Subscription fetch error:', err);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-1">
          <p className="text-lg font-medium">{userName}</p>
          <p className="text-gray-500">{userEmail}</p>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <a 
          href="/reset-password"  // uses your existing pathname logic
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium underline"
        >
          🔒 Change Password
        </a>
      </div>

      {/* Subscription */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Plan:</span><br />
            <span className="font-semibold text-gray-900">{subscription.plan}</span>
          </div>
          <div>
            <span className="text-gray-600">Status:</span><br />
            <span className={`font-semibold ${subscription.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
              {subscription.status}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Expires:</span><br />
            <span className="font-semibold">{subscription.expiry}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
