import { Zap } from 'lucide-react';
import QuickStats from './QuickStats';
import RecentActivity from "./RecentActivity"
import QuickActions from './QuickActions';

interface HomeScreenProps {
  setActiveTab: (tab: string) => void;
}

const HomeScreen = ({ setActiveTab }: HomeScreenProps) => {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
            <p className="text-blue-100">Ready to continue your learning journey?</p>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Zap className="w-8 h-8" />
          </div>
        </div>  
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity />
        <QuickActions setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default HomeScreen;
