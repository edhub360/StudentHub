import React, { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: string;
  duration: string;
  description: string;
}

interface SubscriptionPageProps {
  isFirstTime?: boolean;
  userId?: string;
  onSelectPlan?: (planId: string) => void;
  onComplete?: () => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ 
  isFirstTime = true,
  userId,
  onSelectPlan,
  onComplete 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Static plans - free enabled, others disabled
  const plans: Plan[] = [
    {
      id: 'free',
      name: 'Free Plan',
      price: '₹0',
      duration: '30 days',
      description: 'Perfect to get started'
    },
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: '₹499',
      duration: 'per month',
      description: 'Coming Soon'
    },
    {
      id: 'yearly',
      name: 'Yearly Plan',
      price: '₹4,999',
      duration: 'per year',
      description: 'Coming Soon'
    }
  ];

  const handleActivateFreePlan = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }

      const response = await fetch(`${API_BASE_URL}/auth/activate-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || 'Failed to activate subscription');
      }

      const data = await response.json();
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
          {plans.map((plan) => {
            const isFree = plan.id === 'free';
            const isDisabled = !isFree;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-md p-6 border-2 transition ${
                  isFree 
                    ? 'border-blue-500' 
                    : 'border-gray-200 opacity-60'
                }`}
              >
                {/* Badge for Free Plan */}
                {isFree && (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Recommended
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
                    disabled={loading || success}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Activating...' : success ? '✓ Activated' : 'Get Started'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Coming Soon
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
