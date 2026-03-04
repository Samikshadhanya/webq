import React from 'react';
import { motion } from 'framer-motion';
import { Award, Target, Clock, BookOpen } from 'lucide-react';

interface ProfileStatsProps {
  quizzesTaken: number;
  averageScore: number;
  totalTime: number;
  accuracy?: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  quizzesTaken,
  averageScore,
  totalTime,
  accuracy = 0,
}) => {
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const stats = [
    {
      icon: BookOpen,
      label: 'Quizzes Taken',
      value: quizzesTaken,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      icon: Award,
      label: 'Average Score',
      value: `${averageScore}%`,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Clock,
      label: 'Time Spent',
      value: formatTime(totalTime),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color, bgColor }, index) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${bgColor} rounded-lg p-4 border border-dark-100`}
        >
          <Icon className={`${color} w-6 h-6 mb-2`} />
          <p className="text-gray-400 text-sm mb-1">{label}</p>
          <p className={`${color} text-2xl font-bold`}>{value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default ProfileStats;
