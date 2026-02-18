// src/Components/Screens/SettingsScreen.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Plus, Edit2, Check, X, Loader2 } from 'lucide-react';
import {
  updateUserName,
  fetchSubscriptionInfo,
  fetchPaymentMethods,
  createCustomerPortalSession,
  type SubscriptionInfo,
  type PaymentMethod,
} from '../../services/settingsApi';  // ← adjust path as needed

export default function SettingsScreen() {
  const navigate = useNavigate();

  // ── User state ──────────────────────────────────────────────────────────────
  const [userName, setUserName]       = useState(localStorage.getItem('userName') || 'Guest User');
  const [userEmail]                   = useState(localStorage.getItem('userEmail') || '');
  const [isEditingName, setIsEditing] = useState(false);
  const [editedName, setEditedName]   = useState(userName);
  const [savingName, setSavingName]   = useState(false);

  // ── Subscription state ──────────────────────────────────────────────────────
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    plan: 'Free', status: 'Loading...', expiry: 'N/A',
  });
  const [loadingSub, setLoadingSub] = useState(true);

  // ── Payment Methods state ───────────────────────────────────────────────────
  const [paymentMethods, setPaymentMethods]   = useState<PaymentMethod[]>([]);
  const [loadingPayment, setLoadingPayment]   = useState(true);
  const [isOpeningPortal, setIsOpeningPortal] = useState(false);

  const userId = localStorage.getItem('user_id') || '';

  // ── Fetch on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return;

    fetchSubscriptionInfo(userId)
      .then(setSubscription)
      .catch(() => setSubscription({ plan: 'Error', status: 'Error Loading', expiry: 'N/A' }))
      .finally(() => setLoadingSub(false));

    fetchPaymentMethods(userId)
      .then(setPaymentMethods)
      .catch(console.error)
      .finally(() => setLoadingPayment(false));
  }, [userId]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!editedName.trim()) { alert('Name cannot be empty'); return; }
    setSavingName(true);
    try {
      const saved = await updateUserName(editedName.trim());
      localStorage.setItem('userName', saved);
      setUserName(saved);
      setIsEditing(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedName(userName);
    setIsEditing(false);
  };

  const handleManagePayments = async () => {
    setIsOpeningPortal(true);
    try {
      const url = await createCustomerPortalSession(userId);
      window.location.href = url;
    } catch (e) {
      console.error(e);
      alert('Failed to open payment management. Please try again.');
    } finally {
      setIsOpeningPortal(false);
    }
  };

  const getCardBrandIcon = (brand: string) => {
    const map: Record<string, string> = {
      visa: '💳', mastercard: '💳', amex: '💳',
      discover: '💳', diners: '💳', jcb: '💳', unionpay: '💳',
    };
    return map[brand.toLowerCase()] || '💳';
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      {/* ── Profile ─────────────────────────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        <div className="space-y-3">

          {/* Name - editable */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 min-w-[80px]">Name:</span>
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') handleCancelEdit();
                  }}
                  autoFocus
                  disabled={savingName}
                  placeholder="Enter your name"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
                <button
                  onClick={handleSaveName}
                  disabled={savingName}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Save"
                >
                  {savingName ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={savingName}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-gray-900">{userName}</span>
                <button
                  onClick={() => { setEditedName(userName); setIsEditing(true); }}
                  className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit name"
                >
                  <Edit2 size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Email - read only */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 min-w-[80px]">Email ID:</span>
            <span className="text-gray-700">{userEmail}</span>
          </div>

        </div>
      </section>

      {/* ── Security ─────────────────────────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold mb-4">Security</h2>
        <button
          onClick={() => navigate('/forgot-password')}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Change Password
        </button>
      </section>

      {/* ── Payment Methods ───────────────────────────────────────────────────── */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Payment Methods</h2>
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
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-blue-600" size={24} />
          </div>
        ) : paymentMethods.length > 0 ? (
          <div className="space-y-3">
            {paymentMethods.map((pm) => (
              <div
                key={pm.id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  pm.is_default ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-gray-50'
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
            <button
              onClick={handleManagePayments}
              disabled={isOpeningPortal}
              className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
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
      </section>

      {/* ── Subscription ─────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Subscription</h2>
          <button
            onClick={() => navigate('/subscription')}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Upgrade Plan
          </button>
        </div>

        {loadingSub ? (
          <div className="flex items-center gap-2 py-4 text-gray-600">
            <Loader2 className="animate-spin" size={20} />
            <span>Loading subscription...</span>
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
                subscription.status === 'Active'        ? 'text-green-600' :
                subscription.status === 'No Active Plan'? 'text-gray-600'  : 'text-red-600'
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
      </section>
    </div>
  );
}
