// src/Components/Screens/SettingsScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // ← ADD THIS

export default function SettingsScreen() {
  const navigate = useNavigate();  // ← ADD THIS
  const [userName] = useState(localStorage.getItem('userName') || 'Guest User');
  const [userEmail] = useState(localStorage.getItem('userEmail') || '');
  const [subscription, setSubscription] = useState({ 
    plan: 'Free', 
    status: 'Loading...', 
    expiry: 'N/A' 
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        console.error('No user_id in localStorage');
        setSubscription({ plan: 'Free', status: 'No Active Plan', expiry: 'N/A' });
        setLoading(false);
        return;
      }

      const res = await fetch(
        `https://subscription-service-91248372939.us-central1.run.app/subscriptions/${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.status === 404) {
        setSubscription({ plan: 'Free', status: 'No Active Plan', expiry: 'N/A' });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      
      setSubscription({
        plan: data.plan_id || 'Free',
        status: data.status === 'active' ? 'Active' : data.status,
        expiry: data.current_period_end 
          ? new Date(data.current_period_end).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'N/A'
      });
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setSubscription({ plan: 'Free', status: 'Error Loading', expiry: 'N/A' });
    } finally {
      setLoading(false);
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

      {/* Change Password - FIXED */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <button 
          onClick={() => navigate('/forgot-password')}  /* ← CHANGED FROM <a> */
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
        >
          🔒 Change Password
        </button>
      </div>

      {/* Subscription */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h2 className="text-xl font-semibold mb-4">Subscription</h2>
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading subscription...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan:</span><br />
              <span className="font-semibold text-gray-900 capitalize">{subscription.plan}</span>
            </div>
            <div>
              <span className="text-gray-600">Status:</span><br />
              <span className={`font-semibold ${
                subscription.status === 'Active' ? 'text-green-600' : 
                subscription.status === 'No Active Plan' ? 'text-gray-600' :
                'text-red-600'
              }`}>
                {subscription.status}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Expires:</span><br />
              <span className="font-semibold">{subscription.expiry}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
