import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { getValidAccessToken } from '../../services/TokenManager';
import { getUserSubscription } from '../../services/subscriptionapi';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [seconds, setSeconds] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        console.log('🔍 Verifying subscription...');

        // ✅ Wait for webhook to process (Stripe can take a few seconds)
        await new Promise(resolve => setTimeout(resolve, 4000));

        // ✅ Use getValidAccessToken — auto-refreshes if expired after redirect
        const token = await getValidAccessToken();
        if (!token) {
          setError('Session expired. Please log in again.');
          setSubscriptionStatus('failed');
          return;
        }

        // ✅ Poll subscription service directly — source of truth
        const subscription = await getUserSubscription();

        if (subscription && subscription.status === 'active') {
          console.log('✅ Subscription verified:', subscription);
          // Cache tier for App.tsx to read
          localStorage.setItem('subscription_tier', subscription.plan_name?.toLowerCase() || 'free');
          setSubscriptionStatus('verified');
        } else {
          // Webhook may still be processing — show soft message, still allow dashboard
          console.warn('⚠️ Subscription not yet active, webhook may still be processing');
          setError('Your subscription is being activated. It will reflect shortly.');
          setSubscriptionStatus('failed');
        }
      } catch (err) {
        console.error('❌ Verification failed:', err);
        setError('Payment received. Subscription will activate shortly.');
        setSubscriptionStatus('failed');
      } finally {
        setVerifying(false);
      }
    };

    verifySubscription();
  }, []);

  // Countdown only after verified
  useEffect(() => {
    if (verifying || subscriptionStatus !== 'verified') return;

    const timer = setInterval(() => setSeconds(prev => prev - 1), 1000);
    const redirect = setTimeout(() => navigate('/'), 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate, verifying, subscriptionStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">

        {verifying ? (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h1>
            <p className="text-gray-600">Please wait while we confirm your subscription.</p>
          </>

        ) : subscriptionStatus === 'verified' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful! 🎉</h1>
            <p className="text-gray-600 mb-4">
              Your subscription is now active. Welcome aboard!
            </p>
            {sessionId && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-sm text-gray-500">
                  Session ID: {sessionId.slice(0, 20)}...
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">Redirecting to dashboard in {seconds}s...</p>
          </>

        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Received</h1>
            <p className="text-gray-600 mb-6">
              {error || 'Your payment is being processed. This may take a few moments.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Go to Dashboard
              </button>
              {/* ✅ Retry verification without full page reload */}
              <button
                onClick={() => {
                  setVerifying(true);
                  setSubscriptionStatus('pending');
                  setError('');
                }}
                className="w-full bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition text-sm"
              >
                Check Again
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default SubscriptionSuccess;
