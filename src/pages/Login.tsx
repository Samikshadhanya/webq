import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "../firebase";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const formatUser = (user: any) => ({
    user_id: user.uid,
    role: 'student' as const,
    email: user.email || '',
    name: user.displayName || 'User',
    profile_pic: user.photoURL || '',
    created_at: user.metadata.creationTime || '',
    last_login: user.metadata.lastSignInTime || '',
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
      const result = await signInWithPopup(auth, provider);
      setUser(formatUser(result.user));
      navigate('/');
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Google login failed.");
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

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-dark-300 hover:bg-dark-100 disabled:opacity-60 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 border border-dark-100"
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5"
              />
              {loading ? "Processing..." : "Sign in with Google"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;