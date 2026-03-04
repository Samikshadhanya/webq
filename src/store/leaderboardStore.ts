import { create } from 'zustand';
import { LeaderboardEntry } from '../types';

interface LeaderboardState {
  entries: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  setEntries: (entries: LeaderboardEntry[]) => void;
  addEntry: (entry: LeaderboardEntry) => void;
  updateEntry: (entry: LeaderboardEntry) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useLeaderboardStore = create<LeaderboardState>((set) => ({
  entries: [],
  isLoading: false,
  error: null,

  setEntries: (entries) =>
    set({
      entries: entries.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.time_taken - b.time_taken;
      }),
      error: null,
    }),

  addEntry: (entry) =>
    set((state) => {
      const newEntries = [...state.entries, entry];
      return {
        entries: newEntries.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time_taken - b.time_taken;
        }),
      };
    }),

  updateEntry: (entry) =>
    set((state) => {
      const updated = state.entries.map((e) =>
        e.user_id === entry.user_id ? entry : e
      );
      return {
        entries: updated.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.time_taken - b.time_taken;
        }),
      };
    }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () =>
    set({
      entries: [],
      isLoading: false,
      error: null,
    }),
}));
