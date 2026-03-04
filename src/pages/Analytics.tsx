import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Clock, Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useFirestore } from '../hooks/useFirestore';
import { getUserQuizzes } from '../services/firebaseService';
import PerformanceChart from '../components/PerformanceChart';
import EngagementStats from '../components/EngagementStats';
import { calculateUserStatistics, generateEngagementData, getPerformanceTrend } from '../utils/analyticsHelpers';

const Analytics = () => {
  const { user } = useAuthStore();
  const { getUserResponses } = useFirestore();
  const [stats, setStats] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      if (!user) return;

      try {
        const responses = await getUserResponses(user.user_id);
        const allQuizzes = await getUserQuizzes(user.user_id);

        const quizMap = new Map(allQuizzes.map((q) => [q.quiz_id, q]));
        const calculatedStats = calculateUserStatistics(responses, quizMap);
        const engagementData = generateEngagementData(responses);

        setStats({
          ...calculatedStats,
          engagementData,
          trend: getPerformanceTrend(calculatedStats.scoreHistory),
        });
        setQuizzes(allQuizzes);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user, getUserResponses]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const defaultStats = {
    quizzesTaken: 0,
    averageScore: 0,
    totalTime: 0,
    accuracyByCategory: {},
    scoreHistory: [],
    engagementData: [],
    trend: { trend: 'stable' as const, change: 0 },
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <TrendingUp className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Average Score</h3>
            <p className="text-3xl font-bold text-green-400">{displayStats.averageScore}%</p>
            <p className={`text-sm mt-2 ${
              displayStats.trend.change > 0 ? 'text-green-400' : displayStats.trend.change < 0 ? 'text-red-400' : 'text-gray-400'
            }`}>
              {displayStats.trend.change > 0 ? '+' : ''}{displayStats.trend.change}% from last period
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <Users className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Quizzes Taken</h3>
            <p className="text-3xl font-bold text-blue-400">{displayStats.quizzesTaken}</p>
            <p className="text-sm text-gray-400 mt-2">Total attempts</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <Clock className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Time Spent</h3>
            <p className="text-3xl font-bold text-purple-400">
              {Math.floor(displayStats.totalTime / 3600)}h {Math.floor((displayStats.totalTime % 3600) / 60)}m
            </p>
            <p className="text-sm text-gray-400 mt-2">Learning hours</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <Target className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="text-lg font-semibold text-white">Performance</h3>
            <p className="text-3xl font-bold text-yellow-400">{displayStats.trend.trend}</p>
            <p className="text-sm text-gray-400 mt-2">Trend</p>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <h2 className="text-xl font-bold mb-6 text-white">Score Progress</h2>
            <PerformanceChart data={displayStats.scoreHistory} isLoading={loading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <h2 className="text-xl font-bold mb-6 text-white">Weekly Engagement</h2>
            <EngagementStats data={displayStats.engagementData} isLoading={loading} />
          </motion.div>
        </div>

        {/* Accuracy by Category */}
        {Object.keys(displayStats.accuracyByCategory).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <h2 className="text-xl font-bold mb-6 text-white">Accuracy by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(displayStats.accuracyByCategory).map(([category, accuracy], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-dark-300 rounded-lg p-4 border border-dark-100 text-center"
                >
                  <p className="text-gray-400 text-sm mb-2">{category}</p>
                  <p className="text-2xl font-bold text-primary-400">{accuracy}%</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Analytics;
