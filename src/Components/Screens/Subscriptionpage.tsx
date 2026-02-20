import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { 
  getPlans, 
  createCheckout, 
  getUserSubscription, 
  activateSubscription,
  getFreePlanStatus,        // NEW
  formatPrice
} from '../../services/subscriptionapi';
import type { Plan, PlanPrice, FreePlanStatus } from '../../types/subscription.types';

interface SubscriptionPageProps {
  isFirstTime?: boolean;
  userId?: string;
  onSelectPlan?: (planId: string) => void;
  onComplete?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  isFirstTime = true,
  onSelectPlan,
  onComplete
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [activatingFreePlan, setActivatingFreePlan] = useState(false);
  const [freePlanStatus, setFreePlanStatus] = useState<FreePlanStatus | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPlans, subscription, freeStatus] = await Promise.all([
          getPlans(),
          getUserSubscription(),
          getFreePlanStatus()   
        ]);
        
        setPlans(fetchedPlans);
        setFreePlanStatus(freeStatus);  

        if (subscription && subscription.status === 'active') {
          setActiveSubscriptionId(subscription.plan_id);
        }
      } catch (err) {
        console.error('Failed to load subscription data', err);
        setError('Failed to load plans. Please refresh the page.');
      } finally {
        setInitializing(false);
      }
    };
    
    fetchData();
  }, []);

  const handleActivateFreePlan = async () => {
    // Block if already used/expired — before even calling API
    if (freePlanStatus && !freePlanStatus.eligible && freePlanStatus.status !== 'not_used') {
      setError('Your free plan has already been used and expired. Please upgrade to a paid plan.');
      return;
    }

    setActivatingFreePlan(true);
    setError('');

    try {
      const data = await activateSubscription();
      console.log('✅ Free plan activated:', data);

      // Update local freePlanStatus so button reflects new state
      setFreePlanStatus({
        eligible: false,
        status: 'active',
        message: 'Free plan active',
        expires_at: data.expires_at,
        days_remaining: 7
      });

      setSuccess(true);
      
      setTimeout(() => {
        if (onComplete) onComplete();
        if (onSelectPlan) onSelectPlan('free');
        navigate('/');
      }, 2000);

    } catch (err: any) {
      console.error('Activation error:', err);

      // ✅ Handle specific free plan errors
      if (err.response?.status === 403) {
        setError('Free plan has already been used and expired. Please upgrade to a paid plan.');
        // Update local state to reflect expired
        setFreePlanStatus(prev => prev ? { ...prev, eligible: false, status: 'expired' } : null);
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to activate subscription');
      }
    } finally {
      setActivatingFreePlan(false);
    }
  };

  const handleSubscribe = async (plan: Plan, price: PlanPrice) => {
    setLoading(true);
    setError('');
    try {
      const checkoutUrl = await createCheckout(plan.id, price.billing_period);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  const isFreePlan = (plan: Plan): boolean => {
    return plan.name.toLowerCase() === 'free' || 
           plan.prices.every(p => p.amount === 0);
  };

  // ✅ NEW: Get free plan button label based on status
  const getFreePlanButtonLabel = (): string => {
    if (activatingFreePlan) return 'Activating...';
    if (!freePlanStatus) return 'Activate Free Plan';

    switch (freePlanStatus.status) {
      case 'active':
        return `Active — ${freePlanStatus.days_remaining ?? 0} days remaining`;
      case 'expired':
        return 'Free Plan Expired';
      case 'not_used':
        return 'Activate Free Plan (7 Days)';
      default:
        return 'Activate Free Plan';
    }
  };

  // ✅ NEW: Should the free plan button be disabled?
  const isFreePlanButtonDisabled = (): boolean => {
    if (activatingFreePlan) return true;
    if (!freePlanStatus) return false;
    return freePlanStatus.status === 'active' || freePlanStatus.status === 'expired';
  };

  // ✅ Helper: human-readable billing period label
  const getBillingLabel = (period: string): string => {
    switch (period.toLowerCase()) {
      case 'monthly': return 'month';
      case 'yearly':  return 'year';
      default:        return period;
    }
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">Start with free plan. Upgrade anytime.</p>

        {/* ✅ NEW: Free plan expiry info banner */}
        {freePlanStatus?.status === 'active' && (
          <p className="mt-2 text-sm text-blue-600 font-medium">
            ✅ Free plan active — {freePlanStatus.days_remaining} days remaining
            {freePlanStatus.expires_at && (
              <span className="text-gray-400 ml-1">
                (expires {new Date(freePlanStatus.expires_at).toLocaleDateString()})
              </span>
            )}
          </p>
        )}
        {freePlanStatus?.status === 'expired' && (
          <p className="mt-2 text-sm text-red-500 font-medium">
            ⚠️ Your free plan has expired. Upgrade to continue.
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
          ✅ Free plan activated! Valid for 7 days.
          <br />
          Redirecting to dashboard...
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = activeSubscriptionId === plan.id;
          const isFree = isFreePlan(plan);
          
          return (
            <div
              key={plan.id}
              className={`border rounded-lg p-6 shadow-sm hover:shadow-md transition ${
                isCurrent ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
            >
              {isCurrent && (
                <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full inline-block mb-4">
                  Current Plan
                </div>
              )}

              {/* ✅ NEW: Expired badge on free plan card */}
              {isFree && freePlanStatus?.status === 'expired' && (
                <div className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full inline-block mb-4">
                  Plan Expired
                </div>
              )}

              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>

              {/* ✅ NEW: Free plan expiry info inside card */}
              {isFree && freePlanStatus?.status === 'active' && (
                <p className="text-xs text-blue-500 mb-3">
                  ⏳ {freePlanStatus.days_remaining} days remaining
                </p>
              )}

              {plan.features_json && Object.keys(plan.features_json).length > 0 && (
                <div className="mb-6">
                  <ul className="text-sm text-gray-700 space-y-2">
                    {Object.entries(plan.features_json).map(([key, value]) => (
                      <li key={key} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="capitalize">
                          {key.replace(/_/g, ' ')}: <strong>{String(value)}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="space-y-3 mt-4">
                {isFree ? (
                  <button
                    onClick={handleActivateFreePlan}
                    disabled={isFreePlanButtonDisabled()}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      freePlanStatus?.status === 'expired'
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : freePlanStatus?.status === 'active'
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                    }`}
                  >
                    {getFreePlanButtonLabel()}
                  </button>
                ) : (
                  plan.prices
                    .filter(price => price.is_active)
                    // ✅ FIX: monthly first, yearly second
                    .sort((a, b) => {
                      const order: Record<string, number> = { monthly: 0, yearly: 1 };
                      return (order[a.billing_period] ?? 0) - (order[b.billing_period] ?? 0);
                    })
                    .map((price) => (
                      <button
                        key={price.id}
                        onClick={() => handleSubscribe(plan, price)}
                        disabled={loading || isCurrent}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                          isCurrent
                            ? 'bg-gray-100 text-gray-500 cursor-default'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                        }`}
                      >
                        {isCurrent ? (
                          'Current Plan'
                        ) : loading ? (
                          'Processing...'
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg">
                              {formatPrice(price.amount, price.currency)}
                            </span>
                            <span className="text-sm opacity-90">
                              / {getBillingLabel(price.billing_period)}
                            </span>
                          </div>
                        )}
                      </button>
                    ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        No credit card required for free plan
      </p>
    </div>
  );
};

export default SubscriptionPage;
