import axios from 'axios';
import { getValidAccessToken, getUserId } from './TokenManager';
import type {
  Plan,
  Subscription,
  CheckoutResponse,
  ActivateSubscriptionResponse,
  BillingPeriod
} from '../types/subscription.types';

const API_BASE_URL = 'https://subscription-service-91248372939.us-central1.run.app';

// ========== API FUNCTIONS ==========

export const getPlans = async (): Promise<Plan[]> => {
  const token = await getValidAccessToken();
  const response = await axios.get(`${API_BASE_URL}/plans`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const createCheckout = async (
  planId: string, 
  billingPeriod: BillingPeriod
): Promise<string> => {
  const token = await getValidAccessToken();
  const userId = getUserId();
  if (!userId) {
    throw new Error('User ID not found');
  }
  
  const response = await axios.post<CheckoutResponse>(
    `${API_BASE_URL}/checkout`,
    {
      user_id: userId,
      plan_id: planId,
      billing_period: billingPeriod
    },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return response.data.url;
};

export const getUserSubscription = async (): Promise<Subscription | null> => {
  const token = await getValidAccessToken();
  const userId = getUserId();
  if (!userId) return null;
  
  try {
    const response = await axios.get<Subscription>(
      `${API_BASE_URL}/subscriptions/${userId}`, 
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const cancelSubscription = async (
  cancelAtPeriodEnd: boolean = true
): Promise<void> => {
  const token = await getValidAccessToken();
  const userId = getUserId();
  if (!userId) throw new Error('User ID not found');
  
  await axios.post(
    `${API_BASE_URL}/subscriptions/${userId}/cancel`,
    { cancel_at_period_end: cancelAtPeriodEnd },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const activateSubscription = async (): Promise<ActivateSubscriptionResponse> => {
  const token = await getValidAccessToken();
  const response = await axios.post<ActivateSubscriptionResponse>(
    `${API_BASE_URL}/activate-subscription`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// ========== UTILITY FUNCTIONS ==========

export const formatPrice = (amount: number, currency: string): string => {
  const symbol = currency === 'INR' ? '₹' : '$';
  return `${symbol}${(amount / 100).toFixed(2)}`;
};

export const getPriceByPeriod = (plan: Plan, period: BillingPeriod) => {
  return plan.prices.find(p => p.billing_period === period && p.is_active);
};
