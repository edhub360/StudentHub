import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { WeeklyActivityDay } from '../../types/dashboard.types';

interface WeeklyActivityCardProps {
  data: WeeklyActivityDay[];
}

export const WeeklyActivityCard: React.FC<WeeklyActivityCardProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Weekly Activity</h3>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f1f5f9', radius: 4 }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                color: '#fff', 
                borderRadius: '8px', 
                border: 'none',
                fontSize: '12px'
              }}
              formatter={(value: number) => {
                if (value < 60) {
                  return [`${value}m`, 'Study Time'];
                }
                const hours = (value / 60).toFixed(1);
                return [`${hours}h`, 'Study Time'];
              }}
            />
            <Bar dataKey="minutes" radius={[6, 6, 6, 6]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.minutes >= 180 ? '#0ea5e9' : '#2dd4bf'} // 180m = 3h. Sky blue for high activity, Teal for lower
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
