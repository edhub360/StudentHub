// src/utils/featureAccess.ts

export type SubscriptionTier = 'free' | 'pro' | 'pro max' | null;

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
  }
};

const DEFAULT_ACCESS: FeatureAccess = {
  dashboard: true,
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
  if (!tier) return DEFAULT_ACCESS;
  
  // Normalize: Convert to lowercase and remove extra spaces
  const normalizedTier = tier.toLowerCase().trim().replace(/\s+/g, ' ');
  
  return FEATURE_MATRIX[normalizedTier] || DEFAULT_ACCESS;
}

/**
 * Check if a specific feature is accessible for a tier
 */
export function hasFeatureAccess(
  tier: SubscriptionTier, 
  feature: keyof FeatureAccess
): boolean {
  const access = getFeatureAccess(tier);
  return access[feature];
}

/**
 * Get upgrade message for locked features
 */
export function getUpgradeMessage(feature: string): string {
  return `${feature} is only available for Pro Max subscribers. Upgrade your plan to unlock this feature!`;
}
