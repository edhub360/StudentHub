// src/api/settingsApi.ts

const AUTH_API_BASE = 'https://login-service-91248372939.us-central1.run.app'; 
const SUB_API_BASE  = 'https://subscription-service-91248372939.us-central1.run.app';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// ─── User ────────────────────────────────────────────────────────────────────

export const updateUserName = async (name: string): Promise<string> => {
  const res = await fetch(`${AUTH_API_BASE}/auth/me`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to update name: ${err}`);
  }

  const data = await res.json();
  return data.name ?? name;
};

// ─── Subscription ────────────────────────────────────────────────────────────

export interface SubscriptionInfo {
  plan: string;
  status: string;
  expiry: string;
}

export const fetchSubscriptionInfo = async (userId: string): Promise<SubscriptionInfo> => {
  const [subRes, plansRes] = await Promise.all([
    fetch(`${SUB_API_BASE}/subscriptions/${userId}`, { headers: getAuthHeaders() }),
    fetch(`${SUB_API_BASE}/plans`),
  ]);

  if (subRes.status === 404) {
    return { plan: 'Free', status: 'No Active Plan', expiry: 'N/A' };
  }

  if (!subRes.ok) throw new Error(`HTTP ${subRes.status}`);

  const subData  = await subRes.json();
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
};

// ─── Payment Methods ─────────────────────────────────────────────────────────

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

export const fetchPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const res = await fetch(`${SUB_API_BASE}/payment-methods/${userId}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.payment_methods || [];
};

export const createCustomerPortalSession = async (userId: string): Promise<string> => {
  const res = await fetch(`${SUB_API_BASE}/create-customer-portal-session`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ user_id: userId }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create portal session: ${err}`);
  }

  const data = await res.json();
  return data.url;
};
