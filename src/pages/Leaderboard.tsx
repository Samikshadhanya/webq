import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Clock, TrendingUp } from 'lucide-react';
import { useLeaderboardListener } from '../hooks/useLeaderboardListener';
import LeaderboardTable from '../components/LeaderboardTable';

const Leaderboard = () => {
  const { entries, isLoading } = useLeaderboardListener(10);

  const topScore = entries.length > 0 ? entries[0].score : 0;
  const fastestTime = entries.length > 0 ? Math.min(...entries.map((e) => e.time_taken)) : 0;
  const topScorer = entries.length > 0 ? entries[0] : null;

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">Top Score</h3>
            <p className="text-3xl font-bold text-yellow-400">{topScore}</p>
            <p className="text-sm text-gray-400 mt-2">{topScorer?.name || 'N/A'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <Clock className="w-8 h-8 text-primary-400 mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">Fastest Time</h3>
            <p className="text-3xl font-bold text-primary-400">{formatTime(fastestTime)}</p>
            <p className="text-sm text-gray-400 mt-2">{topScorer?.name || 'N/A'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="text-lg font-semibold text-white mb-2">Participants</h3>
            <p className="text-3xl font-bold text-green-400">{entries.length}</p>
            <p className="text-sm text-gray-400 mt-2">Active players</p>
          </motion.div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-dark-200 rounded-lg border border-dark-100 p-6">
          <h2 className="text-2xl font-bold mb-6 text-white">Top 10 Rankings</h2>
          <LeaderboardTable entries={entries} isLoading={isLoading} limit={10} />
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
