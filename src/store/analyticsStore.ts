import { create } from 'zustand';

export interface AnalyticsData {
  quizzesTaken: number;
  averageScore: number;
  totalTime: number;
  accuracyByCategory: Record<string, number>;
  scoreHistory: Array<{
    date: string;
    score: number;
    quizId: string;
  }>;
  engagementData: Array<{
    week: string;
    count: number;
  }>;
}

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  setData: (data: AnalyticsData) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateScoreHistory: (entry: { date: string; score: number; quizId: string }) => void;
  reset: () => void;
}

const defaultAnalytics: AnalyticsData = {
  quizzesTaken: 0,
  averageScore: 0,
  totalTime: 0,
  accuracyByCategory: {},
  scoreHistory: [],
  engagementData: [],
};

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  setData: (data) =>
    set({
      data,
      error: null,
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  updateScoreHistory: (entry) =>
    set((state) => {
      if (!state.data) return state;
      return {
        data: {
          ...state.data,
          scoreHistory: [...state.data.scoreHistory, entry],
        },
      };
    }),

  reset: () =>
    set({
      data: defaultAnalytics,
      isLoading: false,
      error: null,
    }),
}));
