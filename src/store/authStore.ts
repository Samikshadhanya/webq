import { create } from 'zustand';
import { User, GamificationStats } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  gamificationStats: GamificationStats | null;
  setUser: (user: User | null) => void;
  updateGamificationStats: (stats: Partial<GamificationStats>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  gamificationStats: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateGamificationStats: (stats) => set((state) => ({
    gamificationStats: state.gamificationStats ? { ...state.gamificationStats, ...stats } : stats as GamificationStats,
  })),
  logout: () => set({ user: null, isAuthenticated: false, gamificationStats: null }),
}));
