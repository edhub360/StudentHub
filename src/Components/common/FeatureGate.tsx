// src/Components/Common/FeatureGate.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { hasFeatureAccess, getUpgradeMessage, SubscriptionTier } from '../../utils/featureAccess';

interface FeatureGateProps {
  feature: 'dashboard' | 'aiChat' | 'flashcard' | 'quiz' | 'notebook' | 'screenshot' | 'studyPlanner' | 'courses';
  tier: SubscriptionTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  feature, 
  tier, 
  children, 
  fallback 
}) => {
  const navigate = useNavigate();
  const hasAccess = hasFeatureAccess(tier, feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  // Default locked UI
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Feature Locked
        </h2>
        
        <p className="text-gray-600 mb-6">
          {getUpgradeMessage(feature.charAt(0).toUpperCase() + feature.slice(1))}
        </p>
        
        <button
          onClick={() => navigate('/subscription')}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
        >
          ⬆️ Upgrade Now
        </button>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full mt-3 text-gray-600 hover:text-gray-800 py-2 font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
};
