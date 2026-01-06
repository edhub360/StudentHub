
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StudyPlannerLanding from '../study-plan/StudyPlannerLanding';
import StudyPlanDetail from '../study-plan/StudyPlanDetail';

/**
 * StudyPlanScreen
 * The master orchestrator for the Study Planner.
 * It strictly handles the high-level "View State" and ensures 
 * the Auth context is available for all sub-operations.
 */
const StudyPlanScreen: React.FC = () => {
  const { user } = useAuth();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // 1. Behavior: Authorization Guard
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] text-center p-12">
        <div className="max-w-md bg-white p-12 rounded-[40px] shadow-sm border border-slate-100">
           <div className="bg-rose-50 text-rose-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
             </svg>
           </div>
           <h2 className="text-2xl font-black text-slate-800 mb-4">Access Restricted</h2>
           <p className="text-slate-500 font-medium mb-8">Please sign in to your Edhub360 account to manage your academic roadmaps.</p>
        </div>
      </div>
    );
  }

  // 2. Behavior: View Switching (Gallery vs Detail)
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {selectedPlanId ? (
        <StudyPlanDetail 
          planId={selectedPlanId} 
          onBack={() => setSelectedPlanId(null)} 
        />
      ) : (
        <StudyPlannerLanding 
          onSelectPlan={setSelectedPlanId} 
        />
      )}
    </div>
  );
};

export default StudyPlanScreen;
