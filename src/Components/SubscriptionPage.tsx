import React, { useState } from "react";
import { motion } from "framer-motion";
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle } from "lucide-react";

const stripePromise = loadStripe("pk_test_mock_key_12345"); // Mock public key

interface Plan {
  id: string;
  name: string;
  price: number;
  desc: string;
}

const plans: Plan[] = [
  { id: "basic", name: "Basic", price: 499, desc: "For personal use" },
  { id: "pro", name: "Pro", price: 999, desc: "For small teams" },
  { id: "premium", name: "Premium", price: 1999, desc: "For enterprises" },
];

const SubscriptionPage: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlan) {
      alert("Please select a plan!");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setPaymentSuccess(true);
    setLoading(false);
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl font-extrabold text-center mb-12 mt-6 text-gray-800"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Choose Your Subscription Plan
      </motion.h1>


      {/* Plans */}
      {!paymentSuccess ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full max-w-6xl">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                if (selectedPlan?.id === plan.id) {
                  setSelectedPlan(null); // unselect if already selected
                } else {
                  setSelectedPlan(plan); // select new plan
                }
              }}
              className={`cursor-pointer border-2 rounded-3xl p-8 text-center shadow-lg transition-all duration-300 ${
                selectedPlan?.id === plan.id
                  ? "border-indigo-600 bg-indigo-100"
                  : "border-gray-200 bg-white hover:bg-gray-50"
              }`}
            >
              <h2 className="text-2xl font-semibold mb-3 text-indigo-700">{plan.name}</h2>
              <p className="text-gray-600 mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold mb-5 text-gray-800">₹{plan.price}/month</p>
              {selectedPlan?.id === plan.id && (
                <div className="text-indigo-600 font-medium text-lg">Selected</div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          className="flex flex-col items-center justify-center mt-10"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <CheckCircle size={72} className="text-green-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">
            Payment Successful 🎉
          </h2>
          <p className="text-gray-600 mt-2 text-lg">
            Your {selectedPlan?.name} plan is now active.
          </p>
        </motion.div>
      )}

      {/* Payment Form */}
      {!paymentSuccess && selectedPlan && (
        <motion.div
          className="w-full max-w-md mt-12 bg-white p-8 rounded-3xl shadow-xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Pay ₹{selectedPlan.price} for {selectedPlan.name} Plan
          </h3>
          <div className="border p-4 rounded-lg mb-6 shadow-inner bg-gray-50">
            <CardElement options={{ hidePostalCode: true }} />
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold text-lg hover:bg-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

// Wrapper with Stripe Elements
const SubscriptionWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <SubscriptionPage />
  </Elements>
);

export default SubscriptionWrapper;
