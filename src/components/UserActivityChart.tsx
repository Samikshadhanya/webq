import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserActivityChartProps {
  data: Array<{
    date: string;
    score: number;
    quizId?: string;
  }>;
  isLoading?: boolean;
}

const UserActivityChart: React.FC<UserActivityChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading activity...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No activity data yet. Start taking quizzes!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-dark-300 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#EC4899"
            fillOpacity={1}
            fill="url(#colorScore)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserActivityChart;
