'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Play, LogOut } from 'lucide-react';

interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  creator_name: string;
}

export default function QuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [user, setUser] = useState<any>(null);

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

  const filteredQuizzes = filter
    ? quizzes.filter(
        (q) =>
          q.title.toLowerCase().includes(filter.toLowerCase()) ||
          q.category.toLowerCase().includes(filter.toLowerCase())
      )
    : quizzes;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-900/50 backdrop-blur border-b border-slate-700">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold text-white">Quiz Master</span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">All Quizzes</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search quizzes..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 mb-8"
        />

        {/* Quizzes Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <p className="text-slate-400">No quizzes found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition group"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition flex-1">
                    {quiz.title}
                  </h3>
                  <span className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ml-2 ${
                    quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{quiz.description}</p>

                <div className="flex gap-2 items-center text-xs text-slate-500 mb-4">
                  <span className="bg-slate-700 px-2 py-1 rounded">{quiz.category}</span>
                  <span>By {quiz.creator_name || 'Admin'}</span>
                </div>

                <Link
                  href={`/quiz/${quiz.id}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                >
                  <Play className="w-4 h-4" />
                  Take Quiz
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
