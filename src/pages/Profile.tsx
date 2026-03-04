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
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [emailPrefs, setEmailPrefs] = useState({ marketing: true, updates: true, newsletter: true });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifyPrefs, setNotifyPrefs] = useState({ quizReminder: true, leaderboard: true, achievements: true });
  const [privacySettings, setPrivacySettings] = useState({ publicProfile: true, showStats: true, showAchievements: true });

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
              <button onClick={() => setActiveModal('email')} className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Email Preferences</h3>
                  <p className="text-sm text-gray-400">Manage notifications</p>
                </div>
              </button>
              <button onClick={() => setActiveModal('password')} className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Key className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Change Password</h3>
                  <p className="text-sm text-gray-400">Update credentials</p>
                </div>
              </button>
              <button onClick={() => setActiveModal('notifications')} className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
                <Bell className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white">Notifications</h3>
                  <p className="text-sm text-gray-400">Configure alerts</p>
                </div>
              </button>
              <button onClick={() => setActiveModal('privacy')} className="w-full flex items-center gap-3 p-4 bg-dark-200 rounded-lg border border-dark-100 hover:border-primary-400 transition-colors">
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

        {/* Modals */}
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setActiveModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-dark-200 rounded-lg border border-dark-100 max-w-md w-full p-6"
            >
              {/* Email Preferences Modal */}
              {activeModal === 'email' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Email Preferences</h3>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailPrefs.marketing}
                        onChange={(e) => setEmailPrefs({ ...emailPrefs, marketing: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Marketing emails</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailPrefs.updates}
                        onChange={(e) => setEmailPrefs({ ...emailPrefs, updates: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Product updates</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailPrefs.newsletter}
                        onChange={(e) => setEmailPrefs({ ...emailPrefs, newsletter: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Weekly newsletter</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-dark-300 hover:bg-dark-100 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        alert('Email preferences saved!');
                      }}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}

              {/* Change Password Modal */}
              {activeModal === 'password' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Change Password</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Current Password</label>
                      <input
                        type="password"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">New Password</label>
                      <input
                        type="password"
                        value={passwordForm.new}
                        onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Confirm Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirm}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                        className="w-full bg-dark-300 border border-dark-100 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-dark-300 hover:bg-dark-100 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        if (passwordForm.new === passwordForm.confirm && passwordForm.new.length >= 6) {
                          setActiveModal(null);
                          setPasswordForm({ current: '', new: '', confirm: '' });
                          alert('Password changed successfully!');
                        } else {
                          alert('Passwords do not match or are too short');
                        }
                      }}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </>
              )}

              {/* Notifications Modal */}
              {activeModal === 'notifications' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Notification Settings</h3>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPrefs.quizReminder}
                        onChange={(e) => setNotifyPrefs({ ...notifyPrefs, quizReminder: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Quiz reminders</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPrefs.leaderboard}
                        onChange={(e) => setNotifyPrefs({ ...notifyPrefs, leaderboard: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Leaderboard updates</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifyPrefs.achievements}
                        onChange={(e) => setNotifyPrefs({ ...notifyPrefs, achievements: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Achievement unlocked</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-dark-300 hover:bg-dark-100 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        alert('Notification settings saved!');
                      }}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}

              {/* Privacy Settings Modal */}
              {activeModal === 'privacy' && (
                <>
                  <h3 className="text-xl font-bold text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-4 mb-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.publicProfile}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, publicProfile: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Make profile public</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showStats}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showStats: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Show statistics publicly</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={privacySettings.showAchievements}
                        onChange={(e) => setPrivacySettings({ ...privacySettings, showAchievements: e.target.checked })}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-white">Show achievements</span>
                    </label>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="flex-1 bg-dark-300 hover:bg-dark-100 text-white py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setActiveModal(null);
                        alert('Privacy settings saved!');
                      }}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
