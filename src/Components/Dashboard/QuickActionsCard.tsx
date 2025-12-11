import React from 'react';
import { QuickAction } from '../../types/dashboard.types';
import { MessageCircle, ScanLine, Layers, BrainCircuit } from 'lucide-react';

interface QuickActionsCardProps {
  actions: QuickAction[];
  onActionClick: (id: string) => void;
}

const getActionIcon = (id: string) => {
  switch (id) {
    case 'ask-ai': return MessageCircle;
    case 'scan-solve': return ScanLine;
    case 'flashcards': return Layers;
    case 'take-quiz': return BrainCircuit;
    default: return BrainCircuit;
  }
};

const getActionTheme = (color: string) => {
  switch (color) {
    case 'blue': return { bg: 'bg-blue-50', text: 'text-blue-600' };
    case 'teal': return { bg: 'bg-teal-50', text: 'text-teal-600' };
    case 'green': return { bg: 'bg-emerald-50', text: 'text-emerald-600' };
    case 'purple': return { bg: 'bg-purple-50', text: 'text-purple-600' };
    case 'yellow': return { bg: 'bg-amber-50', text: 'text-amber-600' };
    default: return { bg: 'bg-slate-50', text: 'text-slate-600' };
  }
};

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({ actions, onActionClick }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = getActionIcon(action.id);
          const theme = getActionTheme(action.color);
          
          return (
            <button
              key={action.id}
              onClick={() => onActionClick(action.id)}
              className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${theme.bg} group`}
            >
              <div className={`p-3 rounded-full mb-3 bg-white shadow-sm ${theme.text}`}>
                <Icon size={24} />
              </div>
              <span className="text-sm font-bold text-slate-900 mb-1">{action.title}</span>
              <span className="text-[10px] text-slate-500 font-medium">{action.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};