'use client';

import Link from 'next/link';
import { BookOpen, Trophy, BarChart3, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-slate-900/50 backdrop-blur border-b border-slate-700">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-500" />
          <span className="text-2xl font-bold text-white">Quiz Master</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 text-slate-300 hover:text-white transition">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-[600px] flex items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master Your Knowledge with <span className="text-blue-500">Interactive Quizzes</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8">
            Create, share, and compete in real-time. Track your progress, unlock achievements, and climb the leaderboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center gap-2 transition">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Why Choose Quiz Master?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition">
              <BookOpen className="w-12 h-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Create Quizzes</h3>
              <p className="text-slate-400">Build custom quizzes with multiple question types and difficulty levels.</p>
            </div>

            <div className="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition">
              <Users className="w-12 h-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Share & Compete</h3>
              <p className="text-slate-400">Share quizzes with friends and compete for the highest scores.</p>
            </div>

            <div className="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition">
              <BarChart3 className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Track Progress</h3>
              <p className="text-slate-400">Detailed analytics to monitor your improvement over time.</p>
            </div>

            <div className="p-8 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-blue-500 transition">
              <Trophy className="w-12 h-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Leaderboards</h3>
              <p className="text-slate-400">Global rankings to showcase your expertise to the community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-8">Join thousands of students mastering their knowledge with Quiz Master.</p>
          <Link href="/register" className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition inline-block">
            Create Your Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 border-t border-slate-700 text-center text-slate-400">
        <p>&copy; 2024 Quiz Master. All rights reserved.</p>
      </footer>
    </main>
  );
}
