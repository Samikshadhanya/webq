import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PerformanceChartProps {
  data: Array<{
    date: string;
    score: number;
  }>;
  isLoading?: boolean;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-400">Loading chart...</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="w-full h-64 bg-dark-300 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No performance data yet. Take some quizzes!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64 bg-dark-300 rounded-lg p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
