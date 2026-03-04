import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Trophy, Award } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  limit?: number;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, isLoading, limit = 10 }) => {
  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-400" />;
    return null;
  };

  const getBackgroundColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500/10 border-yellow-500/30';
    if (rank === 2) return 'bg-gray-500/10 border-gray-500/30';
    if (rank === 3) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-dark-300 border-dark-100';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-dark-300 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No leaderboard data yet. Start taking quizzes!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {entries.slice(0, limit).map((entry, index) => (
        <motion.div
          key={entry.user_id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`flex items-center justify-between p-4 rounded-lg border ${getBackgroundColor(
            entry.rank
          )}`}
        >
          <div className="flex items-center gap-4 flex-1">
            {getMedalIcon(entry.rank) && (
              <div className="flex-shrink-0">{getMedalIcon(entry.rank)}</div>
            )}
            <div className="text-lg font-bold text-gray-400 w-8">#{entry.rank}</div>
            <div>
              <p className="text-white font-semibold">{entry.name}</p>
              <p className="text-xs text-gray-400">{entry.user_id}</p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-400">{entry.score}</p>
              <p className="text-xs text-gray-400">Points</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-300">
                {Math.round(entry.time_taken / 60)}m
              </p>
              <p className="text-xs text-gray-400">Time</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LeaderboardTable;
