import React, { useState, useEffect } from 'react';
import { getPlans, createCheckout, getUserSubscription, activateSubscription, type Plan as ApiPlan } from '../../services/subscriptionapi';

interface SubscriptionPageProps {
  isFirstTime?: boolean;
  userId?: string;
  onSelectPlan?: (planId: string) => void;
  onComplete?: () => void;
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  isFirstTime = true,
  userId,
  onSelectPlan,
  onComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [plans, setPlans] = useState<ApiPlan[]>([]);
  const [activeSubscriptionId, setActiveSubscriptionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedPlans, subscription] = await Promise.all([
          getPlans(),
          getUserSubscription()
        ]);
        setPlans(fetchedPlans);
        if (subscription && subscription.status === 'active') {
          setActiveSubscriptionId(subscription.plan_id);
        }
      } catch (err) {
        console.error('Failed to load subscription data', err);
        // Fallback to static plans if API fails, or just show empty/error
        // For now, we'll strip the error to avoid blocking logic, 
        // as the user might not have plans set up yet.
      } finally {
        setInitializing(false);
      }
    };
    fetchData();
  }, []);

  const handleActivateFreePlan = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await activateSubscription();
      console.log('✅ Subscription activated:', data);

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        if (onComplete) {
          onComplete();
        }
        if (onSelectPlan) {
          onSelectPlan('free');
        }
      }, 2000);

    } catch (err: any) {
      console.error('Activation error:', err);
      setError(err.message || 'Failed to activate subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: ApiPlan) => {
    setLoading(true);
    setError('');

    try {
      // Determine billing period based on plan duration or ID
      // This logic depends on how the backend expects the billing_period. 
      // Assuming 'monthly' or 'yearly' can be derived.
      let billingPeriod: 'monthly' | 'yearly' = 'monthly';

      const durationLower = plan.duration.toLowerCase();
      if (durationLower.includes('year') || durationLower.includes('annual')) {
        billingPeriod = 'yearly';
      }
      // If the plan ID itself mimics the period (from mock data structure)
      if (plan.id === 'yearly') billingPeriod = 'yearly';

      const checkoutUrl = await createCheckout(plan.id, billingPeriod);
      window.location.href = checkoutUrl;

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  // Merge static plans if API returns nothing (optional, but good for stability during dev)
  const displayPlans: ApiPlan[] = plans.length > 0 ? plans : [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      duration: '30 days', // or 'per month'
      currency: 'INR',
      description: 'Perfect to get started'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '₹499',
      duration: 'per month',
      currency: 'INR',
      description: 'Standard access'
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '₹4,999',
      duration: 'per year',
      currency: 'INR',
      description: 'Best value'
    }
  ];

  if (initializing) {
    return <div className="min-h-screen flex justify-center items-center">Loading plans...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600">
            Start with free plan. Upgrade anytime.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="max-w-2xl mx-auto mb-8 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-semibold">✅ Free plan activated!</p>
            <p className="text-sm">Redirecting to dashboard...</p>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {displayPlans.map((plan) => {
            const isFree = plan.id === 'free' || plan.price.includes('0'); // aggressive check for free
            const isCurrent = activeSubscriptionId === plan.id;

            // Should we show "Recommended" for actual paid plans? 
            // The original code had it for Free. I'll keep it for Free for now unless changed.
            const isRecommended = isFree;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-md p-6 border-2 transition ${isRecommended
                  ? 'border-blue-500'
                  : 'border-gray-200'
                  } ${isCurrent ? 'ring-2 ring-green-500' : ''}`}
              >
                {/* Badge */}
                {isRecommended && (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Recommended
                  </div>
                )}
                {isCurrent && (
                  <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4 ml-2">
                    Current Plan
                  </div>
                )}

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">
                    / {plan.duration}
                  </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">
                  {plan.description}
                </p>

                {/* Button */}
                {isFree ? (
                  <button
                    onClick={handleActivateFreePlan}
                    disabled={loading || success || isCurrent}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCurrent ? 'Active' : loading ? 'Activating...' : success ? '✓ Activated' : 'Get Started'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={loading || isCurrent}
                    className={`w-full py-3 rounded-lg font-semibold transition ${isCurrent
                      ? 'bg-gray-100 text-gray-500 cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {isCurrent ? 'Current Plan' : loading ? 'Processing...' : 'Subscribe'}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Info Text */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            No credit card required for free plan
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
