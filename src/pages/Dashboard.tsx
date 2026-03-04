import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { calculateUserStats } from '../services/firebaseService';
import { Award, Clock, Calendar, BookOpen, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { getAllQuizzes, getUserResponses } = useFirestore();
  
  const [stats, setStats] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return;

      try {
        const [allQuizzes, userStats] = await Promise.all([
          getAllQuizzes(),
          calculateUserStats(user.user_id),
        ]);

        setQuizzes(allQuizzes.slice(0, 3));
        setStats(userStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        setStats({ quizzesTaken: 0, averageScore: 0, totalTime: 0 });
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, getAllQuizzes, getUserResponses]);

  const defaultStats = {
    quizzesTaken: 0,
    averageScore: 0,
    totalTime: 0,
  };

  const displayStats = stats || defaultStats;

  const stats_cards = [
    { icon: BookOpen, label: 'Quizzes Taken', value: displayStats.quizzesTaken.toString() },
    { icon: Award, label: 'Average Score', value: `${displayStats.averageScore}%` },
    { icon: Clock, label: 'Time Spent', value: `${Math.floor(displayStats.totalTime / 3600)}h ${Math.floor((displayStats.totalTime % 3600) / 60)}m` },
    { icon: Calendar, label: 'Upcoming', value: quizzes.length.toString() },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8"
      >
        {/* Profile Header */}
        <div className="bg-dark-200 rounded-lg p-6 shadow-lg border border-dark-100">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={user?.profile_pic || 'https://via.placeholder.com/64'}
              alt={user?.name}
              className="w-16 h-16 rounded-full border-2 border-primary-400 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats_cards.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-dark-300 rounded-lg p-4 border border-dark-100">
                  <Icon className="w-6 h-6 text-primary-400 mb-2" />
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-2xl font-bold text-white">{value}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-200 rounded-lg p-6 shadow-lg border border-dark-100"
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Performance</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg border border-dark-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Quiz Master</p>
                    <p className="text-xs text-gray-400">Earned 2 days ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-yellow-400">65%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg border border-dark-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Speed Demon</p>
                    <p className="text-xs text-gray-400">Complete quizzes fast</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-400">40%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg border border-dark-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Perfect Score</p>
                    <p className="text-xs text-gray-400">Score 100% on any quiz</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-400">0%</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upcoming Quizzes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-dark-200 rounded-lg p-6 shadow-lg border border-dark-100"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Available Quizzes</h2>
              <button
                onClick={() => navigate('/quiz/list')}
                className="text-sm text-primary-400 hover:text-primary-500 flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            {quizzes.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-400 mb-3">No quizzes available yet</p>
                <button
                  onClick={() => navigate('/quiz/list')}
                  className="text-primary-400 hover:text-primary-500 text-sm"
                >
                  Browse all quizzes
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.quiz_id}
                    className="flex items-center justify-between p-3 bg-dark-300 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/quiz/${quiz.quiz_id}`)}
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-primary-400 transition-colors">{quiz.title}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 rounded bg-dark-100 text-gray-400">{quiz.category}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </div>
                    </div>
                    <Calendar className="w-5 h-5 text-primary-400" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
