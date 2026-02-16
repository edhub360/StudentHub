// src/Components/Screens/SettingsScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus } from 'lucide-react';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export default function SettingsScreen() {
  const navigate = useNavigate();
  const [userName] = useState(localStorage.getItem('userName') || 'Guest User');
  const [userEmail] = useState(localStorage.getItem('userEmail') || '');
  const [subscription, setSubscription] = useState({ 
    plan: 'Free', 
    status: 'Loading...', 
    expiry: 'N/A' 
  });
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false); // ← ADD THIS

  const API_BASE = 'https://subscription-service-91248372939.us-central1.run.app';

  useEffect(() => {
    fetchSubscription();
    fetchPaymentMethods();
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

      const token = localStorage.getItem('token');
      
      const subRes = await fetch(`${API_BASE}/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (subRes.status === 404) {
        setSubscription({ plan: 'Free', status: 'No Active Plan', expiry: 'N/A' });
        setLoading(false);
        return;
      }

      if (!subRes.ok) {
        throw new Error(`HTTP ${subRes.status}`);
      }

      const subData = await subRes.json();
      console.log('📦 Subscription data:', subData);
      
      const plansRes = await fetch(`${API_BASE}/plans`);
      const plansData = await plansRes.json();
      console.log('📋 Plans data:', plansData);
      
      let planName = 'Unknown Plan';
      if (Array.isArray(plansData)) {
        console.log('🔍 Looking for plan_id:', subData.plan_id);
        const plan = plansData.find((p: any) => p.id === subData.plan_id);
        console.log('✅ Found plan:', plan);
        planName = plan ? plan.name : 'Plan Not Found';
      }
      
      setSubscription({
        plan: planName,
        status: subData.status === 'active' ? 'Active' : subData.status,
        expiry: subData.current_period_end 
          ? new Date(subData.current_period_end).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
          : 'N/A'
      });
    } catch (err) {
      console.error('Subscription fetch error:', err);
      setSubscription({ plan: 'Error', status: 'Error Loading', expiry: 'N/A' });
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');
      
      if (!userId) {
        setLoadingPayment(false);
        return;
      }

      const response = await fetch(`${API_BASE}/payment-methods/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data.payment_methods || []);
      }
    } catch (err) {
      console.error('Payment methods fetch error:', err);
    } finally {
      setLoadingPayment(false);
    }
  };

  // ✅ NEW: Open Stripe Customer Portal
  const handleManagePayments = async () => {
    setIsOpeningPortal(true);
    try {
      const userId = localStorage.getItem('user_id');
      const token = localStorage.getItem('token');

      if (!userId) {
        alert('User not found. Please log in again.');
        return;
      }

      const response = await fetch(`${API_BASE}/create-customer-portal-session`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) {
        throw new Error('Failed to create portal session');
      }

      const data = await response.json();
      
      // Redirect to Stripe Customer Portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error opening customer portal:', error);
      alert('Failed to open payment management. Please try again.');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const icons: Record<string, string> = {
      'visa': '💳',
      'mastercard': '💳',
      'amex': '💳',
      'discover': '💳',
      'diners': '💳',
      'jcb': '💳',
      'unionpay': '💳'
    };
    return icons[brand.toLowerCase()] || '💳';
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
      
      {/* User Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-600">Name:</span>
            <p className="text-lg font-medium text-gray-900 mt-1">{userName}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-600">Email ID:</span>
            <p className="text-gray-700 mt-1">{userEmail}</p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <button 
          onClick={() => navigate('/forgot-password')}
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
        >
          Change Password
        </button>
      </div>

      {/* Payment Methods */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
          {/* ✅ UPDATED: Opens Stripe Customer Portal */}
          <button
            onClick={handleManagePayments}
            disabled={isOpeningPortal}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={16} />
            {isOpeningPortal ? 'Opening...' : 'Manage Payment Methods'}
          </button>
        </div>
        
        {loadingPayment ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div 
                key={pm.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  pm.is_default 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="text-gray-600" size={24} />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {getCardBrandIcon(pm.brand)} {pm.brand} •••• {pm.last4}
                    </p>
                    <p className="text-sm text-gray-600">
                      Expires {String(pm.exp_month).padStart(2, '0')}/{pm.exp_year}
                    </p>
                  </div>
                </div>
                {pm.is_default && (
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                    DEFAULT
                  </span>
                )}
              </div>
            ))}
            {/* ✅ ADD: Manage button below cards */}
            <button
              onClick={handleManagePayments}
              disabled={isOpeningPortal}
              className="w-full mt-2 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
            >
              {isOpeningPortal ? 'Opening Stripe...' : 'Manage Cards in Stripe'}
            </button>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="mx-auto mb-2 text-gray-400" size={48} />
            <p>No payment methods on file</p>
            <button
              onClick={handleManagePayments}
              disabled={isOpeningPortal}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
            >
              {isOpeningPortal ? 'Opening...' : 'Add a payment method'}
            </button>
          </div>
        )}
      </div>

      {/* Subscription */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <button
            onClick={() => navigate('/subscription')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Upgrade Plan
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading subscription...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Plan:</span><br />
              <span className="font-semibold text-gray-900">{subscription.plan}</span>
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
