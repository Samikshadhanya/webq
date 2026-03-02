import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUserStats, useQuizzes, useLeaderboard } from '../hooks/useFirestore';
import PointsDisplay from '../components/PointsDisplay';
import StreakCounter from '../components/StreakCounter';
import GamificationCard from '../components/GamificationCard';
import { Award, Clock, Calendar, BookOpen, TrendingUp, Flame } from 'lucide-react';

const Dashboard = () => {
  const { user, updateGamificationStats } = useAuthStore();
  const { stats, loading: statsLoading } = useUserStats(user?.user_id || null);
  const { quizzes, loading: quizzesLoading } = useQuizzes(3);
  const { leaderboard, loading: leaderboardLoading } = useLeaderboard(5);

  useEffect(() => {
    if (stats) {
      updateGamificationStats({
        total_points: stats.total_points || 0,
        streak_days: stats.streak_days || 0,
        last_quiz_date: stats.last_quiz_date || new Date().toISOString(),
        achievements_earned: stats.achievements_earned || [],
        next_milestone: {
          name: 'Quiz Master',
          progress: Math.min((stats.quizzes_taken || 0) / 50, 1),
          required: 50,
        },
      });
    }
  }, [stats, updateGamificationStats]);

  const displayStats = statsLoading
    ? { total_points: 0, streak_days: 0, quizzes_taken: 0, avg_score: 0, total_time: 0 }
    : stats || { total_points: 0, streak_days: 0, quizzes_taken: 0, avg_score: 0, total_time: 0 };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8"
      >
        {/* User Card */}
        <div className="bg-gradient-to-r from-dark-200 to-dark-100 rounded-lg p-6 shadow-lg border border-primary-400/30">
          <div className="flex items-center gap-4 mb-6">
            <motion.img
              src={user?.profile_pic || 'https://via.placeholder.com/64'}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-3 border-primary-400"
              whileHover={{ scale: 1.1 }}
            />
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Auth: {user?.auth_provider || 'email'}</p>
            </div>
            <div className="text-right">
              <PointsDisplay points={displayStats.total_points} size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <GamificationCard
              title="Quizzes Taken"
              value={displayStats.quizzes_taken || 0}
              icon="📚"
              color="primary"
              progress={(displayStats.quizzes_taken || 0) / 50}
            />
            <GamificationCard
              title="Average Score"
              value={`${Math.round(displayStats.avg_score || 0)}%`}
              icon="🎯"
              color="success"
              progress={(displayStats.avg_score || 0) / 100}
            />
            <GamificationCard
              title="Streak"
              value={`${displayStats.streak_days || 0}`}
              icon="🔥"
              color="warning"
            />
            <GamificationCard
              title="Total Time"
              value={`${Math.round((displayStats.total_time || 0) / 60)}m`}
              icon="⏱️"
              color="danger"
            />
            <GamificationCard
              title="Achievements"
              value={0}
              icon="🏆"
              color="primary"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Streak Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {displayStats.streak_days > 0 && <StreakCounter days={displayStats.streak_days} />}
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-dark-200 rounded-lg p-6 shadow-lg border border-dark-100"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-primary-400" />
              <h2 className="text-xl font-bold">Top Performers</h2>
            </div>
            <div className="space-y-3">
              {leaderboardLoading ? (
                <p className="text-gray-400">Loading leaderboard...</p>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <motion.div
                    key={entry.user_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-dark-300 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <motion.span className="text-lg font-bold text-primary-400 w-6">
                        #{entry.rank}
                      </motion.span>
                      <span className="font-semibold text-white">{entry.name}</span>
                    </div>
                    <PointsDisplay points={entry.total_points || 0} size="sm" animated={false} />
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-400">No leaderboard data yet</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Upcoming Quizzes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-200 rounded-lg p-6 shadow-lg border border-dark-100"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary-400" />
            Available Quizzes
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {quizzesLoading ? (
              <p className="text-gray-400">Loading quizzes...</p>
            ) : quizzes.length > 0 ? (
              quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.quiz_id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-4 bg-gradient-to-br from-primary-500/20 to-blue-500/20 rounded-lg border border-primary-400/30 hover:border-primary-400 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-white flex-1">{quiz.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      quiz.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-400'
                        : quiz.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{quiz.description}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{quiz.questions?.length || 0} questions</span>
                    <span>{quiz.time_limit} mins</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-400">No quizzes available</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
