import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle } from 'lucide-react';
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
    const verifyAndUpdateSubscription = async () => {
      try {
        console.log('🔍 Verifying subscription...');
        
        // Wait 3 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Fetch subscription from backend
        const subscription = await getUserSubscription();
        console.log('📋 Subscription data:', subscription);
        
        if (subscription && subscription.status === 'active') {
          // ✅ Update localStorage with subscription info
          const storedUserRaw = localStorage.getItem('user');
          if (storedUserRaw) {
            const storedUser = JSON.parse(storedUserRaw);
            storedUser.subscription_tier = subscription.plan_id;
            localStorage.setItem('user', JSON.stringify(storedUser));
          }
          
          // Also update subscription_tier separately
          localStorage.setItem('subscription_tier', subscription.plan_id);
          
          console.log('✅ Subscription verified and localStorage updated!');
          setSubscriptionStatus('verified');
        } else {
          console.warn('⚠️ Subscription not active yet, might still be processing');
          setError('Subscription is being processed. Please check back in a moment.');
          setSubscriptionStatus('failed');
        }
      } catch (err) {
        console.error('❌ Verification failed:', err);
        setError('Could not verify subscription. Please check your account.');
        setSubscriptionStatus('failed');
      } finally {
        setVerifying(false);
      }
    };
    
    verifyAndUpdateSubscription();
  }, []);

  useEffect(() => {
    // Only start countdown after verification completes
    if (verifying || subscriptionStatus !== 'verified') return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 5000);

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
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment...
            </h1>
            <p className="text-gray-600">
              Please wait while we confirm your subscription.
            </p>
          </>
        ) : subscriptionStatus === 'verified' ? (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing. Your account has been upgraded successfully.
            </p>
            
            {sessionId && (
              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-sm text-gray-500">
                  Session ID: {sessionId.slice(0, 20)}...
                </p>
              </div>
            )}
            
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in {seconds}s...
            </p>
          </>
        ) : (
          <>
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Received
            </h1>
            <p className="text-gray-600 mb-4">
              {error || 'Your payment is being processed. This may take a few moments.'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
