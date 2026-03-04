import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useFirestore } from '../hooks/useFirestore';
import { generateMockQuestions } from '../utils/quizHelpers';
import { createQuiz as createQuizService } from '../services/firebaseService';
import { BookOpen, Clock, Settings, Loader } from 'lucide-react';

const QuizCreate = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { loading: firestoreLoading } = useFirestore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Science');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [timeLimit, setTimeLimit] = useState(1800); // 30 minutes
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Science', 'History', 'Mathematics', 'Literature', 'Geography'];
  const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = ['Easy', 'Medium', 'Hard'];

  const validateForm = () => {
    if (!title.trim()) {
      setError('Quiz title is required');
      return false;
    }
    if (questionCount < 1 || questionCount > 50) {
      setError('Number of questions must be between 1 and 50');
      return false;
    }
    if (timeLimit < 60) {
      setError('Time limit must be at least 1 minute');
      return false;
    }
    return true;
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      const questions = generateMockQuestions(category, difficulty, questionCount);

      const quizData = {
        title,
        description,
        category,
        difficulty,
        created_by: user.user_id,
        time_limit: timeLimit,
        max_participants: 100,
        shuffle_questions: true,
        allow_late_entries: false,
        questions,
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      const quizId = await createQuizService(quizData);

      if (quizId) {
        navigate('/quiz/list');
      } else {
        setError('Failed to create quiz');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-dark-200 rounded-lg shadow-xl border border-dark-100 p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-primary-400" />
            <h1 className="text-3xl font-bold text-white">Create a Quiz</h1>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleCreateQuiz} className="space-y-6">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Quiz Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Biology Basics Quiz"
                className="w-full bg-dark-300 border border-dark-100 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a description for your quiz..."
                rows={4}
                className="w-full bg-dark-300 border border-dark-100 rounded-lg py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-primary-400 resize-none"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-dark-300 border border-dark-100 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary-400"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  className="w-full bg-dark-300 border border-dark-100 rounded-lg py-2 px-4 text-white focus:outline-none focus:border-primary-400"
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Number of Questions: {questionCount}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-gray-400 text-xs mt-1">1-50 questions</p>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Time Limit (minutes): {Math.round(timeLimit / 60)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="180"
                  step="5"
                  value={timeLimit / 60}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value) * 60)}
                  className="w-full"
                />
                <p className="text-gray-400 text-xs mt-1">1-180 minutes</p>
              </div>
            </div>

            <div className="bg-dark-300 rounded-lg p-4 border border-dark-100">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">Quiz Settings</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>✓ Questions will be shuffled randomly</p>
                    <p>✓ Late entries are not allowed</p>
                    <p>✓ All questions are auto-generated</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading || firestoreLoading}
                className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating Quiz...
                  </>
                ) : (
                  'Create Quiz'
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/quiz/list')}
                className="flex-1 bg-dark-300 hover:bg-dark-100 border border-dark-100 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizCreate;
