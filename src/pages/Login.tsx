import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, microsoftProvider, facebookProvider } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const formatUser = (user: any, provider?: string) => ({
    user_id: user.uid,
    role: 'student' as const,
    email: user.email || '',
    name: user.displayName || 'User',
    profile_pic: user.photoURL || '',
    created_at: user.metadata.creationTime || '',
    last_login: user.metadata.lastSignInTime || '',
    auth_provider: provider || 'email' as const,
    total_points: 0,
    streak_days: 0,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(formatUser(result.user));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(formatUser(result.user, 'google'));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleMicrosoftLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      setUser(formatUser(result.user, 'microsoft'));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Microsoft login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      setUser(formatUser(result.user, 'facebook'));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Facebook login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-200 rounded-lg shadow-xl p-8 border border-dark-100">
          <div className="flex justify-center mb-8">
            <LogIn className="w-12 h-12 text-primary-400" />
          </div>

          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Welcome to QuizMaster
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-dark-100 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-dark-300 border border-dark-100 rounded-md focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-100 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 border border-dark-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? "Processing..." : "Sign in with Google"}
            </button>

            <button
              onClick={handleMicrosoftLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-100 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 border border-dark-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" fill="currentColor"/>
              </svg>
              {loading ? "Processing..." : "Sign in with Microsoft"}
            </button>

            <button
              onClick={handleFacebookLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-100 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 border border-dark-100"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
              </svg>
              {loading ? "Processing..." : "Sign in with Facebook"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
