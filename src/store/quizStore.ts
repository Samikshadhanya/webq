import { create } from 'zustand';
import { Quiz, Question } from '../types';

interface QuizSession {
  currentQuiz: Quiz | null;
  currentQuestionIndex: number;
  selectedAnswers: Record<string, string[]>;
  timeRemaining: number;
  isActive: boolean;
  startTime: number | null;
  score: number | null;
}

interface QuizState extends QuizSession {
  setCurrentQuiz: (quiz: Quiz) => void;
  selectAnswer: (questionId: string, optionId: string, isMultiple?: boolean) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  startQuiz: () => void;
  endQuiz: (score: number) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuiz: null,
  currentQuestionIndex: 0,
  selectedAnswers: {},
  timeRemaining: 0,
  isActive: false,
  startTime: null,
  score: null,

  setCurrentQuiz: (quiz) =>
    set({
      currentQuiz: quiz,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: quiz.time_limit || 3600,
      score: null,
    }),

  selectAnswer: (questionId, optionId, isMultiple = false) =>
    set((state) => {
      const currentAnswers = state.selectedAnswers[questionId] || [];
      let newAnswers: string[];

      if (isMultiple) {
        newAnswers = currentAnswers.includes(optionId)
          ? currentAnswers.filter((id) => id !== optionId)
          : [...currentAnswers, optionId];
      } else {
        newAnswers = [optionId];
      }

      return {
        selectedAnswers: {
          ...state.selectedAnswers,
          [questionId]: newAnswers,
        },
      };
    }),

  nextQuestion: () =>
    set((state) => {
      if (!state.currentQuiz) return state;
      const maxIndex = state.currentQuiz.questions.length - 1;
      return {
        currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, maxIndex),
      };
    }),

  previousQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  goToQuestion: (index) =>
    set((state) => {
      if (!state.currentQuiz) return state;
      const validIndex = Math.max(0, Math.min(index, state.currentQuiz.questions.length - 1));
      return { currentQuestionIndex: validIndex };
    }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  startQuiz: () =>
    set({
      isActive: true,
      startTime: Date.now(),
    }),

  endQuiz: (score) =>
    set({
      isActive: false,
      score,
    }),

  resetQuiz: () =>
    set({
      currentQuiz: null,
      currentQuestionIndex: 0,
      selectedAnswers: {},
      timeRemaining: 0,
      isActive: false,
      startTime: null,
      score: null,
    }),
}));
