import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Search, Filter, Zap } from 'lucide-react';
import { useQuizzes } from '../hooks/useFirestore';

const QuizList = () => {
  const { quizzes: allQuizzes, loading } = useQuizzes(100);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All Categories');
  const [filterDifficulty, setFilterDifficulty] = useState('All Difficulties');

  const categories = ['All Categories', 'Mathematics', 'Science', 'History', 'Literature', 'Technology'];
  const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

  const filteredQuizzes = allQuizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All Categories' || quiz.category === filterCategory;
    const matchesDifficulty = filterDifficulty === 'All Difficulties' || quiz.difficulty === filterDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getPointsReward = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 10;
      case 'Medium': return 25;
      case 'Hard': return 50;
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Available Quizzes</h1>
          <p className="text-gray-400">Test your knowledge and earn points</p>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-300 border border-dark-100 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent text-white placeholder-gray-400"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-dark-300 text-white rounded-md px-3 py-2 border border-dark-100 focus:ring-2 focus:ring-primary-400"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="bg-dark-300 text-white rounded-md px-3 py-2 border border-dark-100 focus:ring-2 focus:ring-primary-400"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
          <div className="ml-auto text-sm text-gray-400 py-2">
            {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'zes' : ''}
          </div>
        </motion.div>

        {/* Quiz Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-gray-400 text-center py-8">Loading quizzes...</p>
          ) : filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.quiz_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-dark-200 to-dark-300 rounded-lg p-6 border border-dark-100 hover:border-primary-400 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{quiz.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 ${
                    quiz.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    quiz.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="space-y-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{quiz.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{quiz.time_limit} minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-400" />
                    <span className="text-primary-400 font-semibold">+{getPointsReward(quiz.difficulty)} points</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 pb-4 border-b border-dark-100">
                  <Users className="w-3 h-3" />
                  <span>{quiz.questions?.length || 0} questions</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Start Quiz
                </motion.button>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No quizzes found</p>
              <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizList;
