import { QuizResponse, Quiz } from '../types';

interface UserStats {
  quizzesTaken: number;
  averageScore: number;
  totalTime: number;
  accuracyByCategory: Record<string, number>;
  scoreHistory: Array<{
    date: string;
    score: number;
    quizId: string;
  }>;
}

// Calculate user statistics from quiz responses
export const calculateUserStatistics = (
  responses: QuizResponse[],
  quizzes: Map<string, Quiz>
): UserStats => {
  if (responses.length === 0) {
    return {
      quizzesTaken: 0,
      averageScore: 0,
      totalTime: 0,
      accuracyByCategory: {},
      scoreHistory: [],
    };
  }

  let totalScore = 0;
  let totalTime = 0;
  const categoryStats: Record<string, { total: number; correct: number }> = {};
  const scoreHistory: Array<{ date: string; score: number; quizId: string }> = [];

  responses.forEach((response) => {
    const quiz = quizzes.get(response.quiz_id);
    if (!quiz) return;

    // Calculate score for this quiz
    let quizScore = 0;
    let totalMarks = 0;

    quiz.questions.forEach((question) => {
      totalMarks += question.marks;
      const userAnswers = response.responses.find((r) => r.question_id === question.question_id)
        ?.selected_option_ids || [];
      const correctAnswers = question.correct_option_ids;

      if (
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((ans) => correctAnswers.includes(ans))
      ) {
        quizScore += question.marks;
      }
    });

    totalScore += quizScore;
    totalTime += response.time_taken || 0;

    // Track score history
    scoreHistory.push({
      date: new Date(response.completed_at).toLocaleDateString(),
      score: totalMarks > 0 ? Math.round((quizScore / totalMarks) * 100) : 0,
      quizId: response.quiz_id,
    });

    // Track category accuracy
    const category = quiz.category || 'General';
    if (!categoryStats[category]) {
      categoryStats[category] = { total: 0, correct: 0 };
    }
    categoryStats[category].total += totalMarks;
    categoryStats[category].correct += quizScore;
  });

  // Calculate accuracy by category
  const accuracyByCategory: Record<string, number> = {};
  Object.keys(categoryStats).forEach((category) => {
    const stats = categoryStats[category];
    accuracyByCategory[category] =
      stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
  });

  return {
    quizzesTaken: responses.length,
    averageScore: Math.round(totalScore / responses.length),
    totalTime,
    accuracyByCategory,
    scoreHistory: scoreHistory.slice(-20), // Keep last 20 scores
  };
};

// Generate engagement data (quizzes per week)
export const generateEngagementData = (responses: QuizResponse[]) => {
  const today = new Date();
  const engagementMap: Record<string, number> = {};

  // Initialize last 12 weeks
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i * 7);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    engagementMap[weekKey] = 0;
  }

  // Count quizzes per week
  responses.forEach((response) => {
    const date = new Date(response.completed_at);
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekKey = weekStart.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    if (weekKey in engagementMap) {
      engagementMap[weekKey]++;
    }
  });

  return Object.entries(engagementMap).map(([week, count]) => ({
    week,
    count,
  }));
};

// Format score for display
export const formatScore = (score: number, total: number): string => {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  return `${score}/${total} (${percentage}%)`;
};

// Get performance trend
export const getPerformanceTrend = (scoreHistory: Array<{ date: string; score: number }>): {
  trend: 'improving' | 'declining' | 'stable';
  change: number;
} => {
  if (scoreHistory.length < 2) {
    return { trend: 'stable', change: 0 };
  }

  const recent = scoreHistory.slice(-5);
  const recentAvg = recent.reduce((sum, s) => sum + s.score, 0) / recent.length;
  const older = scoreHistory.slice(0, Math.max(1, scoreHistory.length - 5));
  const olderAvg = older.reduce((sum, s) => sum + s.score, 0) / older.length;

  const change = Math.round(recentAvg - olderAvg);
  const trend: 'improving' | 'declining' | 'stable' =
    change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable';

  return { trend, change };
};
