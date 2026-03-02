import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export const useUserStats = (userId: string | null) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (docSnap) => {
        if (docSnap.exists()) {
          setStats(docSnap.data());
        } else {
          // Initialize new user
          setStats({
            total_points: 0,
            streak_days: 0,
            quizzes_taken: 0,
            avg_score: 0,
            total_time: 0,
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user stats:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { stats, loading, error };
};

export const useQuizzes = (limit: number = 50) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'quizzes')),
      (snapshot) => {
        const quizzesData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          quiz_id: doc.id,
        }));
        setQuizzes(quizzesData.slice(0, limit));
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching quizzes:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { quizzes, loading, error };
};

export const useUserAchievements = (userId: string | null) => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'achievements'), where('user_id', '==', userId)),
      (snapshot) => {
        const achievementsData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          achievement_id: doc.id,
        }));
        setAchievements(achievementsData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching achievements:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { achievements, loading, error };
};

export const useLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'leaderboard')),
      (snapshot) => {
        const leaderboardData = snapshot.docs
          .map((doc) => ({
            ...doc.data(),
            user_id: doc.id,
          }))
          .sort((a, b) => (b.total_points || 0) - (a.total_points || 0))
          .slice(0, limit)
          .map((user, index) => ({
            ...user,
            rank: index + 1,
          }));
        setLeaderboard(leaderboardData);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching leaderboard:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { leaderboard, loading, error };
};
