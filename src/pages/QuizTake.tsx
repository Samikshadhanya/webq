import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useQuizStore } from '../store/quizStore';
import { useFirestore } from '../hooks/useFirestore';
import { calculateQuizScore, shuffleArray } from '../utils/quizHelpers';
import { submitQuizResponse } from '../services/firebaseService';
import QuestionCard from '../components/QuestionCard';
import QuizTimer from '../components/QuizTimer';
import QuizResults from '../components/QuizResults';

const QuizTake = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getQuiz } = useFirestore();
  const {
    currentQuiz,
    currentQuestionIndex,
    selectedAnswers,
    isActive,
    startQuiz,
    endQuiz,
    selectAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    resetQuiz,
  } = useQuizStore();

  const [quiz, setQuiz] = useState(currentQuiz);
  const [loading, setLoading] = useState(!currentQuiz);
  const [showResults, setShowResults] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!currentQuiz && quizId) {
      const loadQuiz = async () => {
        try {
          const loadedQuiz = await getQuiz(quizId);
          if (loadedQuiz) {
            setQuiz(loadedQuiz);
            let questions = loadedQuiz.questions;
            if (loadedQuiz.shuffle_questions) {
              questions = shuffleArray(questions);
            }
            setQuiz({ ...loadedQuiz, questions });
          } else {
            navigate('/quiz/list');
          }
        } catch (error) {
          console.error('Error loading quiz:', error);
          navigate('/quiz/list');
        } finally {
          setLoading(false);
        }
      };
      loadQuiz();
    }
  }, [currentQuiz, quizId, getQuiz, navigate]);

  useEffect(() => {
    if (quiz && !isActive) {
      startQuiz();
      setStartTime(Date.now());
    }
  }, [quiz, isActive, startQuiz]);

  const handleTimeExpired = async () => {
    if (!user || !quiz) return;
    await submitQuizzes();
  };

  const submitQuizzes = async () => {
    if (!user || !quiz) return;

    const { score, totalMarks, percentage } = calculateQuizScore(quiz, selectedAnswers);
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    const questionStats = quiz.questions.map((q) => {
      const userAnswers = selectedAnswers[q.question_id] || [];
      const isCorrect =
        userAnswers.length === q.correct_option_ids.length &&
        userAnswers.every((ans) => q.correct_option_ids.includes(ans));
      return {
        questionId: q.question_id,
        isCorrect,
        timeSpent: 0, // TODO: track per-question time
      };
    });

    const response = {
      user_id: user.user_id,
      quiz_id: quiz.quiz_id,
      started_at: new Date().toISOString(),
      responses: quiz.questions.map((q) => ({
        question_id: q.question_id,
        selected_option_ids: selectedAnswers[q.question_id] || [],
        time_taken: 0,
      })),
      completed_at: new Date().toISOString(),
      score,
      time_taken: timeTaken,
    };

    try {
      await submitQuizResponse(response);
      endQuiz(score);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 mb-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400 mb-4"></div>
          <p className="text-white">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="container mx-auto px-4 py-8 mt-16 mb-8">
        <div className="text-center">
          <p className="text-red-400">Quiz not found. Redirecting...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const { score, totalMarks, percentage } = calculateQuizScore(quiz, selectedAnswers);
    const timeTaken = startTime ? Math.round((Date.now() - startTime) / 1000) : 0;

    const questionStats = quiz.questions.map((q) => {
      const userAnswers = selectedAnswers[q.question_id] || [];
      const isCorrect =
        userAnswers.length === q.correct_option_ids.length &&
        userAnswers.every((ans) => q.correct_option_ids.includes(ans));
      return {
        questionId: q.question_id,
        isCorrect,
        timeSpent: 0,
      };
    });

    return (
      <div className="container mx-auto px-4 py-8 mt-16 mb-8">
        <QuizResults
          quizTitle={quiz.title}
          score={score}
          totalMarks={totalMarks}
          percentage={percentage}
          timeTaken={timeTaken}
          questionStats={questionStats}
        />
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;

  return (
    <div className="container mx-auto px-4 py-8 mt-16 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white">{quiz.title}</h1>
          <QuizTimer
            initialTime={quiz.time_limit}
            onTimeExpired={handleTimeExpired}
            isPaused={false}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentQuestion.question_id}
            question={currentQuestion}
            selectedAnswers={selectedAnswers[currentQuestion.question_id] || []}
            onAnswerSelect={(optionId, isMultiple) => selectAnswer(currentQuestion.question_id, optionId, isMultiple)}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2 bg-dark-300 hover:bg-dark-100 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={submitQuizzes}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Navigation */}
        <div className="mt-6 bg-dark-200 rounded-lg border border-dark-100 p-4">
          <p className="text-gray-400 text-sm mb-3">Quick Navigation:</p>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {quiz.questions.map((q, idx) => (
              <button
                key={q.question_id}
                onClick={() => goToQuestion(idx)}
                className={`w-8 h-8 rounded text-sm font-semibold transition-all ${
                  idx === currentQuestionIndex
                    ? 'bg-primary-500 text-white'
                    : selectedAnswers[q.question_id]?.length
                      ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                      : 'bg-dark-300 text-gray-400 hover:bg-dark-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-dark-200 rounded-lg border border-dark-100">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-white font-semibold mb-2">Quiz Instructions:</h3>
              <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
                <li>Answer all questions before submitting</li>
                <li>You can review answers using quick navigation</li>
                <li>The timer will auto-submit when it reaches zero</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizTake;
