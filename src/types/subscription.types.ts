// src/types/subscription.types.ts

// ========== PLAN TYPES ==========
export interface PlanPrice {
  id: string;
  billing_period: 'monthly' | 'yearly';
  currency: string;
  amount: number;  // Amount in smallest currency unit (e.g., 49900 for ₹499.00)
  stripe_price_id: string;
  is_active: boolean;
}

export interface Plan {
  id: string;
  name: string;
  features_json: Record<string, any>;
  is_active: boolean;
  prices: PlanPrice[];
}

// ========== SUBSCRIPTION TYPES ==========
export interface Subscription {
  id: string;
  customer_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing' | 'paused';
  stripe_subscription_id: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at?: string | null;
  cancelled_at?: string | null;
  ended_at?: string | null;
  trial_ends_at?: string | null;
  updated_at: string;
}

// ========== CUSTOMER TYPES ==========
export interface Customer {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  created_at: string;
}

// ========== REQUEST/RESPONSE TYPES ==========
export interface CheckoutRequest {
  user_id: string;
  plan_id: string;
  billing_period: 'monthly' | 'yearly';
}

export interface CheckoutResponse {
  url: string;
}

export interface CancelSubscriptionRequest {
  cancel_at_period_end: boolean;
}

export type ActivateSubscriptionResponse = {
  message: string;
  subscription_tier: string;
  status: 'activated' | 'already_active';
  activated_at?: string;   
  expires_at?: string;     
};

// ========== HELPER TYPES ==========
export type BillingPeriod = 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing' | 'paused';

export interface PriceFormatted {
  amount: number;
  currency: string;
  formatted: string;  // e.g., "₹499.00"
  billing_period: BillingPeriod;
}

export type FreePlanStatus = {
  eligible: boolean;
  status: 'not_used' | 'active' | 'expired' | 'error';
  message: string;
  expires_at?: string;
  days_remaining?: number;
  expired_at?: string;
};

export type UserSubscriptionOverview = {
  freePlan: FreePlanStatus;
  stripeSubscription: Subscription | null;
  hasAccess: boolean;
  isFreePlanEligible: boolean;
};
