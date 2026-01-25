import axios from 'axios';
import { getValidAccessToken, getUserId } from './TokenManager';

// Use proxy in development to avoid CORS issues
const API_BASE_URL = import.meta.env.MODE === 'development'
    ? '/api/proxy'
    : (import.meta.env.VITE_SUBSCRIPTION_API_URL || 'http://localhost:8000');

export interface Plan {
    id: string;
    name: string;
    price: string;
    currency: string;
    duration: string;
    description: string;
    features?: string[];
}

export interface Subscription {
    id: string;
    status: string;
    plan_id: string;
    current_period_end: number;
}

export const getPlans = async (): Promise<Plan[]> => {
    const token = await getValidAccessToken();
    const response = await axios.get(`${API_BASE_URL}/plans`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createCheckout = async (planId: string, billingPeriod: 'monthly' | 'yearly'): Promise<string> => {
    const token = await getValidAccessToken();
    const userId = getUserId();

    if (!userId) {
        throw new Error('User ID not found');
    }

    const response = await axios.post(`${API_BASE_URL}/checkout`,
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
        const response = await axios.get(`${API_BASE_URL}/subscriptions/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        // If 404, user might not have a subscription
        return null;
    }
};

export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
    const token = await getValidAccessToken();
    await axios.post(`${API_BASE_URL}/subscriptions/${subscriptionId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const activateSubscription = async (): Promise<any> => {
    const token = await getValidAccessToken();
    // Note: user requested /activate-subscription instead of /auth/activate-subscription
    const response = await axios.post(`${API_BASE_URL}/activate-subscription`, {}, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
