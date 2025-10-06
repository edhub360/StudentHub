// SubscriptionWrapper.tsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle, Pocket } from "lucide-react";
import axios from "axios";

const stripePromise = loadStripe("pk_test_mock_key_12345"); // Your Stripe public key

interface Plan {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const SubscriptionPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  // Fetch subscription plans dynamically
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/subscription/");
        setPlans(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load subscription plans.");
      }
    };
    fetchPlans();
  }, []);

  const handleActivatePlan = async () => {
    if (!selectedPlan) {
      setError("Select a plan first!");
      return;
    }

    setError("");

    // Wallet payment first
    if (walletBalance >= selectedPlan.price) {
      setWalletBalance(walletBalance - selectedPlan.price);
      setPaymentSuccess(true);
      return;
    }

    // If wallet not enough, pay via Stripe for remaining amount
    if (!stripe || !elements) {
      setError("Stripe is not loaded.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post("http://localhost:8000/api/wallet/create-payment-intent", {
        planId: selectedPlan.id,
        remainingAmount: selectedPlan.price - walletBalance,
      });

      const card = elements.getElement(CardElement);
      if (!card) return;

      const result = await stripe.confirmCardPayment(data.client_secret, {
        payment_method: { card },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        setPaymentSuccess(true);
        setWalletBalance(0); // wallet amount used
      }
    } catch (err) {
      console.error(err);
      setError("Payment failed, try again.");
    }

    setLoading(false);
  };

  return (
    <motion.div className="flex flex-col items-center min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Wallet Balance Input */}
      <div className="flex items-center mb-6 space-x-4">
        <Pocket size={32} className="text-indigo-600" />
        <input
          type="number"
          placeholder="Enter wallet amount"
          value={walletBalance}
          onChange={(e) => setWalletBalance(parseInt(e.target.value))}
          className="border p-2 rounded-lg w-40"
        />
        <span className="font-semibold text-lg">₹</span>
      </div>

      <motion.h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-8 text-gray-800">
        Choose Your Subscription Plan
      </motion.h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!paymentSuccess ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedPlan(selectedPlan?.id === plan.id ? null : plan)}
              className={`cursor-pointer border-2 rounded-3xl p-6 text-center shadow-lg transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-100"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-2 text-indigo-700">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.desc}</p>
              <p className="text-2xl font-bold mb-2">₹{plan.price}</p>
              {selectedPlan?.id === plan.id && <div className="text-indigo-600 font-medium text-lg">Selected</div>}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div className="flex flex-col items-center mt-8">
          <CheckCircle size={72} className="text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Plan Activated!</h2>
          <p className="text-gray-600 mt-2 text-lg">
            Your {selectedPlan?.name} plan is now active.
          </p>
          <p className="text-gray-600 mt-2 text-lg">Remaining Wallet Balance: ₹{walletBalance}</p>
        </motion.div>
      )}

      {!paymentSuccess && selectedPlan && (
        <motion.div className="w-full max-w-md mt-8">
          <div className="border p-4 rounded-lg mb-4 shadow-inner bg-gray-50">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
          <button
            onClick={handleActivatePlan}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700"
          >
            {loading ? "Processing..." : "Activate Plan / Pay"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const SubscriptionWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionPage />
  </Elements>
);

export default SubscriptionWrapper;
