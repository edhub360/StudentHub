import { FileText, Brain, MessageCircle } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    { icon: FileText, title: 'Completed Calculus flashcards', time: '2 hours ago', color: 'blue' },
    { icon: Brain, title: 'Biology quiz - 85% score', time: 'Yesterday', color: 'green' },
    { icon: MessageCircle, title: 'AI Chat session on Physics', time: '2 days ago', color: 'purple' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-4 space-y-3">
        {activities.map((act, i) => {
          const Icon = act.icon;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 bg-${act.color}-100 rounded-full flex items-center justify-center`}>
                <Icon className={`w-4 h-4 text-${act.color}-600`} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{act.title}</p>
                <p className="text-xs text-gray-500">{act.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
