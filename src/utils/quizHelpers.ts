import { Quiz, Question, QuizResponse } from '../types';

// Generate mock quiz questions based on topic and difficulty
export const generateMockQuestions = (
  topic: string,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  count: number
): Question[] => {
  const questionPools = {
    Science: {
      Easy: [
        {
          question_text: 'What is the chemical symbol for water?',
          options: [
            { text: 'H2O' },
            { text: 'O2' },
            { text: 'CO2' },
            { text: 'NaCl' },
          ],
          correct: 0,
        },
        {
          question_text: 'Which planet is closest to the sun?',
          options: [
            { text: 'Venus' },
            { text: 'Mercury' },
            { text: 'Mars' },
            { text: 'Earth' },
          ],
          correct: 1,
        },
      ],
      Medium: [
        {
          question_text: 'What is the process by which plants make food?',
          options: [
            { text: 'Photosynthesis' },
            { text: 'Respiration' },
            { text: 'Fermentation' },
            { text: 'Digestion' },
          ],
          correct: 0,
        },
      ],
      Hard: [
        {
          question_text: 'What is the half-life of Carbon-14?',
          options: [
            { text: '5,730 years' },
            { text: '1,000 years' },
            { text: '10,000 years' },
            { text: '500 years' },
          ],
          correct: 0,
        },
      ],
    },
    History: {
      Easy: [
        {
          question_text: 'In which year did World War II end?',
          options: [
            { text: '1943' },
            { text: '1944' },
            { text: '1945' },
            { text: '1946' },
          ],
          correct: 2,
        },
      ],
      Medium: [
        {
          question_text: 'Who was the first President of the United States?',
          options: [
            { text: 'Thomas Jefferson' },
            { text: 'George Washington' },
            { text: 'John Adams' },
            { text: 'Benjamin Franklin' },
          ],
          correct: 1,
        },
      ],
      Hard: [
        {
          question_text: 'In what year did the Byzantine Empire fall?',
          options: [
            { text: '1450' },
            { text: '1453' },
            { text: '1460' },
            { text: '1470' },
          ],
          correct: 1,
        },
      ],
    },
    Mathematics: {
      Easy: [
        {
          question_text: 'What is 2 + 2?',
          options: [
            { text: '3' },
            { text: '4' },
            { text: '5' },
            { text: '6' },
          ],
          correct: 1,
        },
      ],
      Medium: [
        {
          question_text: 'What is the square root of 144?',
          options: [
            { text: '10' },
            { text: '11' },
            { text: '12' },
            { text: '13' },
          ],
          correct: 2,
        },
      ],
      Hard: [
        {
          question_text: 'What is the derivative of x³?',
          options: [
            { text: '3x²' },
            { text: 'x²' },
            { text: '3x' },
            { text: 'x³/3' },
          ],
          correct: 0,
        },
      ],
    },
  };

  const selectedPool = questionPools[topic as keyof typeof questionPools] || questionPools.Science;
  const difficultyQuestions = selectedPool[difficulty] || selectedPool.Easy;

  const questions: Question[] = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    const mockQuestion = difficultyQuestions[i % difficultyQuestions.length];
    questions.push({
      question_id: `q_${i + 1}`,
      question_text: mockQuestion.question_text,
      options: mockQuestion.options.map((opt, idx) => ({
        option_id: `opt_${idx + 1}`,
        text: opt.text,
      })),
      correct_option_ids: [`opt_${mockQuestion.correct + 1}`],
      marks: difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3,
    });
  }

  return questions;
};

// Calculate quiz score
export const calculateQuizScore = (
  quiz: Quiz,
  responses: Record<string, string[]>
): { score: number; totalMarks: number; percentage: number } => {
  let score = 0;
  let totalMarks = 0;

  quiz.questions.forEach((question) => {
    totalMarks += question.marks;
    const userAnswers = responses[question.question_id] || [];
    const correctAnswers = question.correct_option_ids;

    if (
      userAnswers.length === correctAnswers.length &&
      userAnswers.every((ans) => correctAnswers.includes(ans))
    ) {
      score += question.marks;
    }
  });

  return {
    score,
    totalMarks,
    percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
  };
};

// Format time in seconds to readable format
export const formatTime = (seconds: number): string => {
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

// Shuffle array (for shuffling questions if enabled)
export const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
