import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { Mail, Key, Bell, Shield, LogOut, Edit2 } from 'lucide-react';
import ProfileStats from '../components/ProfileStats';
import UserActivityChart from '../components/UserActivityChart';
import { getUserQuizResponses } from '../services/firebaseService';

const Profile = () => {
  const { user, logout } = useAuth();
  const { getUserResponses } = useFirestore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return;

      try {
        const responses = await getUserResponses(user.user_id);
        
        if (responses.length === 0) {
          setStats({
            quizzesTaken: 0,
            averageScore: 0,
            totalTime: 0,
            accuracy: 0,
            scoreHistory: [],
          });
        } else {
          const totalScore = responses.reduce((sum, r) => sum + (r.score || 0), 0);
          const totalTime = responses.reduce((sum, r) => sum + (r.time_taken || 0), 0);
          const avgScore = Math.round(totalScore / responses.length);

          const scoreHistory = responses.map((r) => ({
            date: new Date(r.completed_at).toLocaleDateString(),
            score: r.score || 0,
          }));

          setStats({
            quizzesTaken: responses.length,
            averageScore: avgScore,
            totalTime,
            accuracy: avgScore,
            scoreHistory,
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, getUserResponses]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  const defaultStats = {
    quizzesTaken: 0,
    averageScore: 0,
    totalTime: 0,
    accuracy: 0,
    scoreHistory: [],
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Profile Header */}
        <div className="bg-dark-200 rounded-lg p-6 border border-dark-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.profile_pic || 'https://via.placeholder.com/128'}
              alt={user?.name}
              className="w-32 h-32 rounded-full border-4 border-primary-400 object-cover"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-400 mt-2">
                Role: <span className="capitalize text-primary-400">{user?.role}</span>
              </p>
              <p className="text-sm text-gray-400">
                Member since {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Stats</h2>
          <ProfileStats
            quizzesTaken={displayStats.quizzesTaken}
            averageScore={displayStats.averageScore}
            totalTime={displayStats.totalTime}
            accuracy={displayStats.accuracy}
          />
        </div>

        {/* Activity Chart */}
        {displayStats.scoreHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-200 rounded-lg p-6 border border-dark-100"
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Activity</h2>
            <UserActivityChart data={displayStats.scoreHistory} isLoading={loading} />
          </motion.div>
        )}

        {/* Settings */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Settings</h2>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Email Preferences</h3>
                  <p className="text-sm text-gray-400">Manage notifications</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Key className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Change Password</h3>
                  <p className="text-sm text-gray-400">Update credentials</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Bell className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-gray-400">Configure alerts</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Shield className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Privacy</h3>
                  <p className="text-sm text-gray-400">Manage privacy</p>
                </div>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-red-400">Logout</h3>
                  <p className="text-sm text-gray-400">Sign out</p>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold text-white">Quick Info</h2>
            <div className="space-y-3">
              <div className="p-4 bg-dark-200 rounded-lg border border-dark-100">
                <p className="text-sm text-gray-400 mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {displayStats.quizzesTaken > 0 ? '7 days' : '0 days'}
                </p>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg border border-dark-100">
                <p className="text-sm text-gray-400 mb-1">Rank</p>
                <p className="text-2xl font-bold text-blue-400">Top 15%</p>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg border border-dark-100">
                <p className="text-sm text-gray-400 mb-1">Achievements</p>
                <p className="text-2xl font-bold text-green-400">5</p>
              </div>
              <div className="p-4 bg-dark-200 rounded-lg border border-dark-100">
                <p className="text-sm text-gray-400 mb-1">Level</p>
                <p className="text-2xl font-bold text-purple-400">Expert</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
