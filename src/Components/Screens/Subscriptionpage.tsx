import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  getPlans,
  createCheckout,
  getUserSubscription,
  formatPrice
} from '../../services/subscriptionapi';
import type { Plan, PlanPrice, Subscription } from '../../types/subscription.types';

interface SubscriptionPageProps {
  isFirstTime?: boolean;
  userId?: string;
  onSelectPlan?: (planId: string) => void;
  onComplete?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [activeSubscription, setActiveSubscription] = useState<Subscription | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Show message if redirected from App.tsx due to expiry
  const expiredMessage = (location.state as any)?.message;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPlans, subscription] = await Promise.all([
          getPlans(),
          getUserSubscription(),
        ]);
        setPlans(fetchedPlans);
        if (subscription && subscription.status === 'active') {
          setActiveSubscription(subscription);
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

  const handleSubscribe = async (plan: Plan, price: PlanPrice) => {
    setLoading(true);
    setError('');
    try {
      const checkoutUrl = await createCheckout(plan.id, price.billing_period);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error('Checkout error:', err);
      // Handle 403 — free plan already used
      if (err.response?.status === 403) {
        setError('Free plan has already been used. Please upgrade to a paid plan.');
      } else if (err.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || err.message || 'Failed to initiate checkout');
      }
      setLoading(false);
    }
  };

  const isFreePlan = (plan: Plan): boolean => {
    return plan.name.toLowerCase() === 'free' || plan.prices.every(p => p.amount === 0);
  };

  const isCurrentPlan = (plan: Plan): boolean => {
    return activeSubscription?.plan_id === plan.id;
  };

  const getBillingLabel = (period: string): string => {
    switch (period.toLowerCase()) {
      case 'monthly': return 'month';
      case 'yearly':  return 'year';
      default:        return period;
    }
  };

  const getFreePlanButtonLabel = (plan: Plan): string => {
    if (loading) return 'Processing...';
    if (isCurrentPlan(plan)) return 'Current Plan';
    // If user has an active sub but it's not free — they already used free
    if (activeSubscription && !isCurrentPlan(plan)) return 'Start Free Trial';
    return 'Start Free Trial (7 Days)';
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Back Button */}
      <button
        onClick={() => navigate('/login')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Login</span>
      </button>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">Start with a free trial. Upgrade anytime.</p>
      </div>

      {/* Expired redirect message */}
      {expiredMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          ⚠️ {expiredMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan);
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

              <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>

              {/* Features */}
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

              {/* Buttons — same flow for ALL plans including free */}
              <div className="space-y-3 mt-4">
                {plan.prices
                  .filter(price => price.is_active)
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
                      ) : isFree ? (
                        // Free plan shows label without price
                        getFreePlanButtonLabel(plan)
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">
                            {formatPrice(price.amount, price.currency)}
                          </span>
                          <span className="text-sm opacity-90">
                            /{getBillingLabel(price.billing_period)}
                          </span>
                        </div>
                      )}
                    </button>
                  ))
                }
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-center text-gray-500 mt-8 text-sm">
        No credit card required for free trial
      </p>
    </div>
  );
};

export default SubscriptionPage;
