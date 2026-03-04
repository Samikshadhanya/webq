import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementStatsProps {
  data: Array<{
    week: string;
    count: number;
  }>;
  isLoading?: boolean;
}

const EngagementStats: React.FC<EngagementStatsProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading stats...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No engagement data yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-dark-300 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="week" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.5rem',
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementStats;
