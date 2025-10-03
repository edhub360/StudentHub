import { MessageCircle, Camera, FileText, Brain } from 'lucide-react';

interface QuickActionsProps {
  setActiveTab: (tab: string) => void;
}

const QuickActions = ({ setActiveTab }: QuickActionsProps) => {
  const actions = [
    { label: 'Ask AI', desc: 'Get instant help', icon: MessageCircle, color: 'blue', tab: 'chat' },
    { label: 'Scan & Solve', desc: 'Photo questions', icon: Camera, color: 'teal', tab: 'upload' },
    { label: 'Flashcards', desc: 'Review concepts', icon: FileText, color: 'green', tab: 'flashcards' },
    { label: 'Take Quiz', desc: 'Test knowledge', icon: Brain, color: 'purple', tab: 'quiz' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
      </div>
      <div className="p-4 grid grid-cols-2 gap-3">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveTab(act.tab)}
              className={`p-4 bg-${act.color}-50 hover:bg-${act.color}-100 rounded-xl transition-colors group`}
            >
              <div className={`w-8 h-8 bg-${act.color}-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="font-medium text-gray-900 text-sm">{act.label}</p>
              <p className="text-xs text-gray-500">{act.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
