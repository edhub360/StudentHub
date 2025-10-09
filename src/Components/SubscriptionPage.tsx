import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, CreditCard, AlertCircle, Sparkles, Zap, Crown, Check, LucideIcon } from "lucide-react";
import axios from "axios";

const stripePromise = loadStripe(
  "pk_test_51SF3YMDzr10khT0GRhe9nAH8JTfXXJgslReP8PnBr0brzGtDIg8VtLBooxNAZnwXSNI3hzg3E0WlfNILchjm538f00faXxV2Jb"
);

const API_BASE_URL = "http://localhost:8000";

interface Plan {
  id: number;
  plan_id: string;
  name: string;
  price: number;
  description: string;
  created_at: string;
}

interface PlanConfig {
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  badge?: string;
  features: string[];
}

const SubscriptionPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [userId] = useState<string>("user_" + Math.random().toString(36).substr(2, 9));

  // ✅ Updated: Unified teal/cyan theme to match dashboard
  const planDetails: Record<string, PlanConfig> = {
    free: {
      icon: Sparkles,
      color: "from-teal-500 to-cyan-500",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      features: ["7-Day Free Trial", "Basic Features", "Email Support", "Limited Access", "Cancel Anytime"]
    },
    deluxe: {
      icon: Zap,
      color: "from-cyan-500 to-blue-500",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      badge: "Most Popular",
      features: ["All Basic Features", "Priority Support", "Advanced Analytics", "Team Collaboration", "50 GB Storage"]
    },
    premium: {
      icon: Crown,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      badge: "Best Value",
      features: ["All Deluxe Features", "24/7 Premium Support", "Custom Integrations", "Unlimited Storage", "Advanced Security"]
    }
  };

  useEffect(() => {
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
  }, []);

  const handleActivatePlan = async () => {
    if (!selectedPlan) {
      setError("Please select a plan first!");
      return;
    }

    if (selectedPlan.price === 0) {
      try {
        await axios.post(`${API_BASE_URL}/api/subscription/activate`, {
          user_id: userId,
          plan_id: selectedPlan.plan_id,
          payment_method: "free_trial"
        });
        setPaymentSuccess(true);
      } catch (err: any) {
        setError("Failed to activate free trial.");
      }
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe is not loaded. Please refresh the page.");
      return;
    }

    setError("");
    setLoading(true);

    try {
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
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.response?.data?.detail || "Payment failed. Please try again.");
    }

    setLoading(false);
  };

  const getPlanConfig = (planId: string): PlanConfig => {
    if (planId.includes('free') || planId.includes('trial') || planId.includes('basic')) return planDetails.free;
    if (planId.includes('deluxe') || planId.includes('premium')) return planDetails.deluxe;
    return planDetails.premium;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {!paymentSuccess ? (
          <>
            {/* Header Section */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 mb-4">
                Choose Your
                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent"> Plan</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Start with a free trial or upgrade to unlock premium features
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
                const config = getPlanConfig(plan.plan_id);
                const Icon = config.icon;
                const isSelected = selectedPlan?.id === plan.id;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                    onClick={() => setSelectedPlan(plan)}
                    className="relative cursor-pointer group"
                  >
                    {/* Popular Badge */}
                    {config.badge && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                        <div className={`bg-gradient-to-r ${config.color} text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg`}>
                          {config.badge}
                        </div>
                      </div>
                    )}

                    <div className={`relative h-full bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ${
                      isSelected ? 'ring-4 ring-cyan-500 shadow-2xl' : 'hover:shadow-2xl'
                    }`}>
                      {/* Selected Indicator */}
                      {isSelected && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 bg-cyan-500 text-white rounded-full p-2 shadow-lg z-10"
                        >
                          <Check size={20} />
                        </motion.div>
                      )}

                      {/* Header with Gradient */}
                      <div className={`bg-gradient-to-r ${config.color} p-8 text-white`}>
                        <Icon className="mb-4" size={40} />
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-white text-opacity-90 text-sm">{plan.description}</p>
                      </div>

                      {/* Price Section */}
                      <div className="p-8">
                        <div className="mb-6">
                          {plan.price === 0 ? (
                            <div>
                              <div className="text-5xl font-bold text-gray-900">Free</div>
                              <div className="text-gray-500 text-sm mt-1">7-day trial</div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-baseline">
                                <span className="text-5xl font-bold text-gray-900">₹{plan.price}</span>
                                <span className="text-gray-500 ml-2">/month</span>
                              </div>
                              <div className="text-teal-600 text-sm mt-1 font-semibold">
                                💰 Best price guaranteed
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Features List */}
                        <ul className="space-y-3 mb-8">
                          {config.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-gray-700">
                              <Check className="text-teal-500 mr-3 flex-shrink-0 mt-0.5" size={18} />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Select Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPlan(plan);
                          }}
                          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-r ${config.color} text-white shadow-lg transform scale-105`
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : 'Select Plan'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Payment Section */}
            <AnimatePresence>
              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                      <CreditCard className="mr-3 text-cyan-600" size={28} />
                      Complete Your Purchase
                    </h3>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-700 font-medium">Selected Plan:</span>
                        <span className="text-xl font-bold text-gray-900">{selectedPlan.name}</span>
                      </div>
                      <div className="flex justify-between items-center pt-4 border-t border-teal-200">
                        <span className="text-gray-700 font-medium">Total Amount:</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          {selectedPlan.price === 0 ? 'FREE' : `₹${selectedPlan.price}`}
                        </span>
                      </div>
                    </div>

                    {/* Card Input for Paid Plans */}
                    {selectedPlan.price > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Payment Information
                        </label>
                        <div className="border-2 border-gray-200 rounded-xl p-4 bg-gray-50 focus-within:border-cyan-500 transition-colors">
                          <CardElement
                            options={{
                              hidePostalCode: true,
                              style: {
                                base: {
                                  fontSize: "16px",
                                  color: "#1f2937",
                                  fontFamily: "system-ui, -apple-system, sans-serif",
                                  "::placeholder": { color: "#9ca3af" },
                                },
                                invalid: { color: "#ef4444", iconColor: "#ef4444" },
                              },
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button
                      onClick={handleActivatePlan}
                      disabled={loading || (selectedPlan.price > 0 && !stripe)}
                      className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-3">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : selectedPlan.price === 0 ? (
                        "Start Free Trial 🎉"
                      ) : (
                        `Pay ₹${selectedPlan.price} & Activate`
                      )}
                    </button>

                    {/* Trust Badges */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span>Secure Payment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        <span>SSL Encrypted</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>PCI Compliant</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Section */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-16 text-center"
            >
              <p className="text-gray-500 text-sm mb-4">Trusted by over 10,000+ customers worldwide</p>
              <div className="flex justify-center items-center gap-8 flex-wrap opacity-50 grayscale">
                <div className="text-2xl font-bold text-gray-400">VISA</div>
                <div className="text-2xl font-bold text-gray-400">Mastercard</div>
                <div className="text-2xl font-bold text-gray-400">Stripe</div>
              </div>
            </motion.div>
          </>
        ) : (
          /* Success Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="inline-block mb-6"
              >
                <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-full p-6 shadow-lg">
                  <CheckCircle size={80} className="text-white" />
                </div>
              </motion.div>

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                {selectedPlan?.price === 0 ? 'Trial Activated!' : 'Payment Successful!'}
              </h2>
              <p className="text-xl text-gray-600 mb-2">
                Your <span className="font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{selectedPlan?.name}</span> is now active
              </p>
              <p className="text-gray-500 mb-8">
                {selectedPlan?.price === 0 ? 'Enjoy your 7-day free trial!' : 'Thank you for your purchase!'}
              </p>

              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 mb-8">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Plan</p>
                    <p className="text-lg font-bold text-gray-900">{selectedPlan?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedPlan?.price === 0 ? 'FREE' : `₹${selectedPlan?.price}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-teal-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Explore More Plans
                </button>
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1 bg-white border-2 border-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SubscriptionWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionPage />
  </Elements>
);

export default SubscriptionWrapper;
