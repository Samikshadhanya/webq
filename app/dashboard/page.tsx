'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, LogOut, Play, Plus, Trophy, TrendingUp } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  creator_name: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userStr));
    fetchQuizzes();
  }, [router]);

  async function fetchQuizzes() {
    try {
      const res = await fetch('/api/quizzes');
      const data = await res.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    router.push('/');
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-900/50 backdrop-blur border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold text-white">Quiz Master</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="text-slate-300">{user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome, {user.name}!</h1>
          <p className="text-slate-400 text-lg">Take quizzes, track your progress, and compete with friends</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <BookOpen className="w-12 h-12 text-blue-500" />
              <div>
                <p className="text-slate-400 text-sm">Total Quizzes</p>
                <p className="text-3xl font-bold text-white">{quizzes.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
              <div>
                <p className="text-slate-400 text-sm">Best Score</p>
                <p className="text-3xl font-bold text-white">-</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12 text-green-500" />
              <div>
                <p className="text-slate-400 text-sm">Quizzes Taken</p>
                <p className="text-3xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-12">
          <Link
            href="/quizzes"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
          >
            <Play className="w-5 h-5" />
            Browse Quizzes
          </Link>
          <Link
            href="/create-quiz"
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </Link>
        </div>

        {/* Quizzes List */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Available Quizzes</h2>
          
          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-400">Loading quizzes...</p>
            </div>
          ) : quizzes.length === 0 ? (
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
              <p className="text-slate-400 mb-4">No quizzes available yet</p>
              <Link
                href="/create-quiz"
                className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
              >
                Create the first one
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={`/quiz/${quiz.id}`}
                  className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                      {quiz.title}
                    </h3>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${
                      quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                      quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {quiz.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-4">{quiz.description}</p>
                  <div className="flex gap-2 items-center text-xs text-slate-500">
                    <span className="bg-slate-700 px-2 py-1 rounded">{quiz.category}</span>
                    <span>By {quiz.creator_name || 'Admin'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
