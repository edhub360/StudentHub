// src/api/settingsApi.ts

import { getValidAccessToken, getUserId } from '../services/TokenManager';

const AUTH_API_BASE = 'https://login-service-91248372939.us-central1.run.app';
const SUB_API_BASE  = 'https://subscription-service-91248372939.us-central1.run.app';

const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const token = await getValidAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export { getUserId };

// ─── User ─────────────────────────────────────────────────────────────────────

export const updateUserName = async (name: string): Promise<string> => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${AUTH_API_BASE}/auth/me`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update name: ${err}`);
  }

  const data = await res.json();
  return data.name ?? name;
};

// ─── Subscription ─────────────────────────────────────────────────────────────

export interface SubscriptionInfo {
  plan: string;
  status: string;
  expiry: string;
}

export const fetchSubscriptionInfo = async (userId: string): Promise<SubscriptionInfo> => {
  const headers = await getAuthHeaders();

  const [subRes, plansRes] = await Promise.all([
    fetch(`${SUB_API_BASE}/subscriptions/${userId}`, { headers }),
    fetch(`${SUB_API_BASE}/plans`),
  ]);

  // ✅ Handle 200 response (paid OR free plan fallback)
  if (subRes.ok) {
    const subData   = await subRes.json();

    // ✅ FREE PLAN — from backend fallback (type: "free")
    if (subData.type === 'free') {
      return {
        plan: 'Free',
        status: subData.status === 'active' ? 'Active' : 'Expired',
        expiry: subData.current_period_end
          ? new Date(subData.current_period_end).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric',
            })
          : 'N/A',
      };
    }

    // ✅ PAID PLAN — match plan_id against plans list
    const plansData = await plansRes.json();
    let planName = 'Unknown Plan';
    if (Array.isArray(plansData)) {
      const plan = plansData.find((p: any) => p.id === subData.plan_id);
      planName = plan ? plan.name : 'Plan Not Found';
    }

    return {
      plan: planName,
      status: subData.status === 'active' ? 'Active' : subData.status,
      expiry: subData.current_period_end
        ? new Date(subData.current_period_end).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
          })
        : 'N/A',
    };
  }

  // ✅ No Stripe subscription (404) — check free plan status
  if (subRes.status === 404) {
    try {
      const freePlanRes = await fetch(
        `${SUB_API_BASE}/free-plan-status`,
        { headers }
      );

      if (!freePlanRes.ok) {
        return { plan: 'Free', status: 'No Active Plan', expiry: 'N/A' };
      }

      const freePlan = await freePlanRes.json();

      if (freePlan.status === 'active') {
        return {
          plan: 'Free',
          status: 'Active',
          expiry: freePlan.expires_at
            ? new Date(freePlan.expires_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })
            : 'N/A',
        };
      }

      if (freePlan.status === 'expired') {
        return {
          plan: 'Free',
          status: 'Expired',
          expiry: freePlan.expired_at
            ? new Date(freePlan.expired_at).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })
            : 'N/A',
        };
      }

      return { plan: 'Free', status: 'No Active Plan', expiry: 'N/A' };

    } catch {
      return { plan: 'Free', status: 'No Active Plan', expiry: 'N/A' };
    }
  }

  // ✅ Any other HTTP error
  throw new Error(`HTTP ${subRes.status}`);
};


// ─── Payment Methods ──────────────────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${SUB_API_BASE}/payment-methods/${userId}`, { headers });

  if (!res.ok) return [];

  const data = await res.json();
  return data.payment_methods || [];
};

export const createCustomerPortalSession = async (userId: string): Promise<string> => {
  const headers = await getAuthHeaders();

  const res = await fetch(`${SUB_API_BASE}/create-customer-portal-session`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create portal session: ${err}`);
  }

  const data = await res.json();
  return data.url;
};
