import { useEffect, useCallback } from 'react';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { subscribeToLeaderboard } from '../services/firebaseService';

export const useLeaderboardListener = (limit: number = 10) => {
  const { entries, isLoading, error, setEntries, setLoading, setError } =
    useLeaderboardStore();

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToLeaderboard(limit, (data) => {
        setEntries(data);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe to leaderboard';
      setError(message);
      setLoading(false);
    }
  }, [limit, setEntries, setLoading, setError]);

  return { entries, isLoading, error };
};
