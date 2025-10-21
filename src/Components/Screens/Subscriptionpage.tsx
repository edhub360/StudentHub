import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, CreditCard, AlertCircle, Sparkles, Zap, Crown, Check, Lock } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51SF3YMDzr10khT0GRhe9nAH8JTfXXJgslReP8PnBr0brzGtDIg8VtLBooxNAZnwXSNI3hzg3E0WlfNILchjm538f00faXxV2Jb");

const API_BASE_URL = "http://localhost:8000";

interface Plan {
  id: number;
  plan_id: string;
  name: string;
  price: number;
  description: string;
  created_at: string;
}

const SubscriptionPage: React.FC<{ isFirstTime?: boolean }> = ({ isFirstTime = false }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [userId] = useState<string>(localStorage.getItem('user_id') || "user_" + Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    // Save user_id to localStorage
    if (!localStorage.getItem('user_id')) {
      localStorage.setItem('user_id', userId);
    }

    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/subscription/`);
        setPlans(res.data);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load subscription plans.");
      }
    };
    fetchPlans();
  }, [userId]);

  const handleActivatePlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan first!");
      return;
    }

    // First time users can only activate free trial
    if (isFirstTime && selectedPlan.price > 0) {
      setError("Please start with the free trial first!");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (selectedPlan.price === 0) {
        // Free trial activation
        await axios.post(`${API_BASE_URL}/api/subscription/activate`, {
          user_id: userId,
          plan_id: selectedPlan.plan_id,
          payment_method: "free_trial"
        });
        setPaymentSuccess(true);
        
        // Mark onboarding complete
        await axios.post(`${API_BASE_URL}/api/subscription/mark-onboarding-complete/${userId}`);
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } else {
        // Paid plan activation
        if (!stripe || !elements) {
          setError("Stripe is not loaded. Please refresh the page.");
          setLoading(false);
          return;
        }

        const { data } = await axios.post(`${API_BASE_URL}/api/payment/create-payment-intent`, {
          user_id: userId,
          plan_id: selectedPlan.plan_id,
          remaining_amount: selectedPlan.price,
        });

        const card = elements.getElement(CardElement);
        if (!card) {
          setError("Card element not found");
          setLoading(false);
          return;
        }

        const result = await stripe.confirmCardPayment(data.client_secret, {
          payment_method: { card },
        });

        if (result.error) {
          setError(result.error.message || "Payment failed");
        } else if (result.paymentIntent?.status === "succeeded") {
          await axios.post(`${API_BASE_URL}/api/subscription/activate`, {
            user_id: userId,
            plan_id: selectedPlan.plan_id,
            payment_method: "stripe"
          });
          setPaymentSuccess(true);
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error("Activation error:", err);
      setError(err.response?.data?.detail || "Activation failed. Please try again.");
    }

    setLoading(false);
  };

  const isTrialPlan = (planId: string) => {
    return planId.includes('trial') || planId.includes('free') || planId.includes('basic');
  };

  const isPlanDisabled = (plan: Plan) => {
    // If first time, only trial plan is enabled
    if (isFirstTime) {
      return plan.price > 0;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header with First Time Message */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          {isFirstTime && (
            <div className="bg-cyan-100 border-l-4 border-cyan-500 p-4 mb-6 rounded-r-lg max-w-2xl mx-auto">
              <p className="text-cyan-800 font-semibold">
                🎉 Welcome! Start with our 30-day free trial. Premium plans will be available after your trial.
              </p>
            </div>
          )}
          
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            Choose Your
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isFirstTime ? "Start your journey with a free trial" : "Upgrade or manage your subscription"}
          </p>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto mb-6"
            >
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-sm">
                <div className="flex items-center">
                  <AlertCircle className="text-red-500 mr-3" size={20} />
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan, index) => {
            const isTrial = isTrialPlan(plan.plan_id);
            const disabled = isPlanDisabled(plan);
            const isSelected = selectedPlan?.id === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={!disabled ? { y: -8 } : {}}
                onClick={() => !disabled && setSelectedPlan(plan)}
                className={`relative cursor-pointer group ${disabled ? 'opacity-60' : ''}`}
              >
                {/* Disabled Overlay */}
                {disabled && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-50 rounded-2xl z-10 flex items-center justify-center">
                    <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <Lock size={20} className="text-gray-600" />
                        <span className="font-semibold text-gray-700">Available after trial</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                  isSelected && !disabled ? 'ring-4 ring-cyan-500 shadow-2xl' : 'hover:shadow-2xl'
                }`}>
                  {isSelected && !disabled && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 bg-cyan-500 text-white rounded-full p-2 shadow-lg z-10"
                    >
                      <Check size={20} />
                    </motion.div>
                  )}

                  <div className={`${isTrial ? 'bg-gradient-to-r from-teal-500 to-cyan-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'} p-8 text-white`}>
                    {isTrial ? <Sparkles className="mb-4" size={40} /> : <Crown className="mb-4" size={40} />}
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-white text-opacity-90 text-sm">{plan.description}</p>
                  </div>

                  <div className="p-8">
                    <div className="mb-6">
                      {plan.price === 0 ? (
                        <div>
                          <div className="text-5xl font-bold text-gray-900">Free</div>
                          <div className="text-gray-500 text-sm mt-1">30-day trial</div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                            <span className="text-gray-500 ml-2">/month</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!disabled) setSelectedPlan(plan);
                      }}
                      disabled={disabled}
                      className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                        disabled
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isSelected
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {disabled ? '🔒 Locked' : isSelected ? '✓ Selected' : 'Select Plan'}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Payment Section */}
        <AnimatePresence>
          {selectedPlan && !isPlanDisabled(selectedPlan) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <CreditCard className="mr-3 text-cyan-600" size={28} />
                  {selectedPlan.price === 0 ? 'Start Your Free Trial' : 'Complete Your Purchase'}
                </h3>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Selected Plan:</span>
                    <span className="text-xl font-bold text-gray-900">{selectedPlan.name}</span>
                  </div>
                </div>

                {selectedPlan.price > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Information
                    </label>
                    <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
                      <CardElement />
                    </div>
                  </div>
                )}

                <button
                  onClick={handleActivatePlan}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
                >
                  {loading ? "Processing..." : selectedPlan.price === 0 ? "Start Free Trial 🎉" : `Pay ₹${selectedPlan.price} & Activate`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Screen */}
        {paymentSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
              <CheckCircle size={80} className="text-teal-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Success!</h2>
              <p className="text-gray-600 mb-4">Your {selectedPlan?.name} is now active</p>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SubscriptionWrapper: React.FC<{ isFirstTime?: boolean }> = ({ isFirstTime }) => (
  <Elements stripe={stripePromise}>
    <SubscriptionPage isFirstTime={isFirstTime} />
  </Elements>
);

export default SubscriptionWrapper;
