import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, ArrowLeft, Share2, Download } from 'lucide-react';

interface QuizResultsProps {
  quizTitle: string;
  score: number;
  totalMarks: number;
  percentage: number;
  timeTaken: number;
  questionStats: Array<{
    questionId: string;
    isCorrect: boolean;
    timeSpent: number;
  }>;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quizTitle,
  score,
  totalMarks,
  percentage,
  timeTaken,
  questionStats,
}) => {
  const navigate = useNavigate();

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: "Outstanding! 🎉", color: 'text-green-400' };
    if (percentage >= 75) return { text: 'Great job! 👏', color: 'text-blue-400' };
    if (percentage >= 60) return { text: 'Good effort! 📚', color: 'text-yellow-400' };
    return { text: 'Keep practicing! 💪', color: 'text-orange-400' };
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const performance = getPerformanceMessage();
  const correctAnswers = questionStats.filter((q) => q.isCorrect).length;
  const accuracy = Math.round((correctAnswers / questionStats.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-200 rounded-lg shadow-xl border border-dark-100 p-8"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100, damping: 10 }}
          className="inline-block mb-4"
        >
          <Award className="w-16 h-16 text-primary-400" />
        </motion.div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{quizTitle}</h2>
        <p className={`text-xl font-semibold ${performance.color}`}>{performance.text}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-300 rounded-lg p-4 border border-dark-100 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Score</p>
          <p className="text-3xl font-bold text-primary-400">
            {score}/{totalMarks}
          </p>
          <p className="text-sm text-gray-400 mt-2">{percentage}%</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-300 rounded-lg p-4 border border-dark-100 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Accuracy</p>
          <p className="text-3xl font-bold text-blue-400">{accuracy}%</p>
          <p className="text-sm text-gray-400 mt-2">
            {correctAnswers}/{questionStats.length}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-dark-300 rounded-lg p-4 border border-dark-100 text-center"
        >
          <p className="text-gray-400 text-sm mb-2">Time Taken</p>
          <p className="text-xl font-bold text-yellow-400">{formatTime(timeTaken)}</p>
        </motion.div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-4">Performance Breakdown</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
            <span className="text-gray-400">Correct Answers</span>
            <span className="font-semibold text-green-400">{correctAnswers}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
            <span className="text-gray-400">Incorrect Answers</span>
            <span className="font-semibold text-red-400">
              {questionStats.length - correctAnswers}
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-dark-300 rounded-lg">
            <span className="text-gray-400">Average Time per Question</span>
            <span className="font-semibold text-gray-300">
              {Math.round(timeTaken / questionStats.length)}s
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => navigate('/quiz/list')}
          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Quizzes
        </button>
        <button
          onClick={() => window.location.href = '/leaderboard'}
          className="flex-1 bg-dark-300 hover:bg-dark-100 border border-dark-100 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          View Leaderboard
        </button>
      </div>
    </motion.div>
  );
};

export default QuizResults;
