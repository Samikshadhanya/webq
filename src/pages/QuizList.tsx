import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Users, BookOpen, Plus } from 'lucide-react';
import { useFirestore } from '../hooks/useFirestore';
import { useQuizStore } from '../store/quizStore';

const QuizList = () => {
  const navigate = useNavigate();
  const { getAllQuizzes } = useFirestore();
  const { setCurrentQuiz } = useQuizStore();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredQuizzes, setFilteredQuizzes] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const allQuizzes = await getAllQuizzes();
        setQuizzes(allQuizzes);
        setFilteredQuizzes(allQuizzes);
      } catch (error) {
        console.error('Error loading quizzes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [getAllQuizzes]);

  useEffect(() => {
    let filtered = quizzes;

    if (categoryFilter !== 'All') {
      filtered = filtered.filter((q) => q.category === categoryFilter);
    }

    if (difficultyFilter !== 'All') {
      filtered = filtered.filter((q) => q.difficulty === difficultyFilter);
    }

    setFilteredQuizzes(filtered);
  }, [categoryFilter, difficultyFilter, quizzes]);

  const handleStartQuiz = (quiz: any) => {
    setCurrentQuiz(quiz);
    navigate(`/quiz/${quiz.quiz_id}`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Hard':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Available Quizzes</h1>
            <p className="text-gray-400 mt-1">{filteredQuizzes.length} quizzes available</p>
          </div>
          <button
            onClick={() => navigate('/quiz/create')}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Quiz
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-dark-300 text-white rounded-lg px-3 py-2 border border-dark-100 focus:border-primary-400 focus:outline-none"
            >
              <option>All</option>
              <option>Science</option>
              <option>History</option>
              <option>Mathematics</option>
              <option>Literature</option>
              <option>Geography</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full bg-dark-300 text-white rounded-lg px-3 py-2 border border-dark-100 focus:border-primary-400 focus:outline-none"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        {/* Quiz Cards */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
            <p className="text-gray-400">Loading quizzes...</p>
          </div>
        ) : filteredQuizzes.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No quizzes match your filters</p>
            <button
              onClick={() => {
                setCategoryFilter('All');
                setDifficultyFilter('All');
              }}
              className="text-primary-400 hover:text-primary-500"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredQuizzes.map((quiz, index) => (
              <motion.div
                key={quiz.quiz_id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-dark-200 rounded-lg p-6 border border-dark-100 hover:border-primary-400 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{quiz.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{quiz.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(quiz.difficulty)} whitespace-nowrap ml-2`}>
                    {quiz.difficulty}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <BookOpen className="w-4 h-4" />
                    <span>{quiz.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{Math.round(quiz.time_limit / 60)} minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{quiz.participants?.length || 0} participants</span>
                  </div>
                </div>

                <button
                  onClick={() => handleStartQuiz(quiz)}
                  className="w-full mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Start Quiz
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default QuizList;
