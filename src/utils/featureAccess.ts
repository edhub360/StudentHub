// src/utils/featureAccess.ts

export type SubscriptionTier = 'free' | 'pro' | 'pro max' | 'expired' | null;

export interface FeatureAccess {
  dashboard: boolean;
  aiChat: boolean;
  flashcard: boolean;
  quiz: boolean;
  notebook: boolean;
  screenshot: boolean;
  studyPlanner: boolean;
  courses: boolean;
}

const FEATURE_MATRIX: Record<string, FeatureAccess> = {
  'free': {
    dashboard: true,
    aiChat: true,
    flashcard: true,
    quiz: true,
    notebook: true,
    screenshot: false,
    studyPlanner: false,
    courses: true,
  },
  'pro': {
    dashboard: true,
    aiChat: true,
    flashcard: true,
    quiz: true,
    notebook: true,
    screenshot: false,
    studyPlanner: false,
    courses: true,
  },
  'pro max': {
    dashboard: true,
    aiChat: true,
    flashcard: true,
    quiz: true,
    notebook: true,
    screenshot: true,
    studyPlanner: true,
    courses: true,
  },
};

// No subscription at all — expired, logged out, or NULL tier
const DEFAULT_ACCESS: FeatureAccess = {
  dashboard: true,   // always accessible
  aiChat: false,
  flashcard: false,
  quiz: false,
  notebook: false,
  screenshot: false,
  studyPlanner: false,
  courses: false,
};

/**
 * Get feature access permissions for a subscription tier
 */
export function getFeatureAccess(tier: SubscriptionTier): FeatureAccess {
  if (tier === null) return DEFAULT_ACCESS;       // logged out or no subscription
  if (tier === 'expired') return DEFAULT_ACCESS;  // subscription expired

  const normalizedTier = tier.toLowerCase().trim().replace(/\s+/g, ' ');
  return FEATURE_MATRIX[normalizedTier] ?? DEFAULT_ACCESS;
}

/**
 * Check if a specific feature is accessible for a tier
 */
export function hasFeatureAccess(
  tier: SubscriptionTier,
  feature: keyof FeatureAccess
): boolean {
  return getFeatureAccess(tier)[feature];
}

/**
 * Get upgrade message for locked features
 */
export function getUpgradeMessage(feature: string): string {
  const proMaxFeatures = ['Screenshot', 'Study Planner'];
  if (proMaxFeatures.includes(feature)) {
    return `${feature} is only available on the Pro Max plan. Upgrade to unlock this feature!`;
  }
  return `${feature} requires an active subscription. Subscribe to a plan to unlock this feature!`;
}

/**
 * Check if the user has any active subscription (any paid tier)
 */
export function hasActiveSubscription(tier: SubscriptionTier): boolean {
  return tier !== null && tier !== 'expired';
}