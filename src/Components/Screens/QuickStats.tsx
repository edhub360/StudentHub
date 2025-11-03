import { Trophy, Target, Clock, Award } from 'lucide-react';

const QuickStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">Study Streak</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">7 days</p>
        <p className="text-xs text-gray-500">Keep it up!</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-gray-700">Today's Goal</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">75%</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700">Study Time</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">2.5h</p>
        <p className="text-xs text-gray-500">Today</p>
      </div>

      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">Badges</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">12</p>
        <p className="text-xs text-gray-500">Earned</p>
      </div>
    </div>
  );
};

export default QuickStats;
