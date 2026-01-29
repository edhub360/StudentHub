import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { getUserSubscription } from '../../services/subscriptionapi';
import type { Subscription } from '../../types/subscription.types';

const SubscriptionSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [seconds, setSeconds] = useState(5);
  const [verifying, setVerifying] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        // Wait 2 seconds for webhook to process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const sub = await getUserSubscription();
        if (sub && sub.status === 'active') {
          setSubscription(sub);
        } else {
          setError('Subscription verification pending. Please check your account in a moment.');
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setError('Could not verify subscription status');
      } finally {
        setVerifying(false);
      }
    };
    
    verifySubscription();
  }, []);

  useEffect(() => {
    if (verifying) return;

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
  }, [navigate, verifying]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {verifying ? 'Verifying Subscription...' : 'Subscription Successful!'}
        </h1>
        
        {verifying ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto my-4"></div>
        ) : error ? (
          <p className="text-yellow-600 mb-4">{error}</p>
        ) : (
          <>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing. Your account has been upgraded successfully.
            </p>
            
            {sessionId && (
              <p className="text-sm text-gray-500 mb-4">
                Session ID: {sessionId.slice(0, 20)}...
              </p>
            )}
            
            {subscription && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4 text-left">
                <p className="text-sm text-gray-700">
                  <strong>Plan:</strong> {subscription.plan_id}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Status:</strong> <span className="text-green-600 capitalize">{subscription.status}</span>
                </p>
              </div>
            )}
          </>
        )}
        
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in {seconds}s...
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
