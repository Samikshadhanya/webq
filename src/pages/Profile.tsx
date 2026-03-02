import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useUserStats, useUserAchievements } from '../hooks/useFirestore';
import BadgeDisplay from '../components/BadgeDisplay';
import PointsDisplay from '../components/PointsDisplay';
import { Settings, Mail, Key, Bell, Shield, LogOut, Trophy } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuthStore();
  const { stats, loading: statsLoading } = useUserStats(user?.user_id || null);
  const { achievements, loading: achievementsLoading } = useUserAchievements(user?.user_id || null);

  const allAchievements = [
    { name: 'Quiz Master', icon: '🎓', earned: achievements.some(a => a.achievement_id === 'quiz_master'), progress: 0.8 },
    { name: 'Perfect Score', icon: '💯', earned: achievements.some(a => a.achievement_id === 'perfect_score'), progress: 0.6 },
    { name: 'Speed Demon', icon: '⚡', earned: achievements.some(a => a.achievement_id === 'speed_demon'), progress: 0.4 },
    { name: 'Consistent Learner', icon: '📖', earned: achievements.some(a => a.achievement_id === 'consistent'), progress: 0.9 },
    { name: 'Rising Star', icon: '🌟', earned: achievements.some(a => a.achievement_id === 'rising_star'), progress: 0.5 },
    { name: 'Ultimate Learner', icon: '🏆', earned: achievements.some(a => a.achievement_id === 'ultimate'), progress: 0.3 },
  ];

  const displayStats = statsLoading
    ? { total_points: 0, streak_days: 0, quizzes_taken: 0, avg_score: 0 }
    : stats || { total_points: 0, streak_days: 0, quizzes_taken: 0, avg_score: 0 };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="bg-dark-200 rounded-lg p-6 border border-dark-100">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={user?.profile_pic}
              alt={user?.name}
              className="w-32 h-32 rounded-full border-4 border-primary-400"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-400 mt-2">Member since {new Date(user?.created_at || '').toLocaleDateString()}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary-400/20 text-primary-400">
                  Quiz Master
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-400/20 text-purple-400">
                  Top 10%
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-400/20 text-green-400">
                  Active Learner
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">Settings</h2>
            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Mail className="w-5 h-5 text-primary-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Email Preferences</h3>
                  <p className="text-sm text-gray-400">Manage your email notifications</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Key className="w-5 h-5 text-primary-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Change Password</h3>
                  <p className="text-sm text-gray-400">Update your security credentials</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Bell className="w-5 h-5 text-primary-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Notifications</h3>
                  <p className="text-sm text-gray-400">Configure your notification settings</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Shield className="w-5 h-5 text-primary-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold">Privacy</h3>
                  <p className="text-sm text-gray-400">Manage your privacy settings</p>
                </div>
              </button>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-red-400 transition-colors"
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-red-400">Logout</h3>
                  <p className="text-sm text-gray-400">Sign out of your account</p>
                </div>
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">Achievements</h2>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div
                  key={achievement.name}
                  className="p-4 bg-dark-200 rounded-lg border border-dark-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <span className="text-sm text-primary-400">{achievement.progress}%</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                  <div className="w-full bg-dark-300 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      className="bg-primary-400 h-2 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
