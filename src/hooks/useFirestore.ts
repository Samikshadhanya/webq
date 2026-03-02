import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

// Mock data for development
const MOCK_USER_STATS = {
  total_points: 2450,
  streak_days: 12,
  quizzes_taken: 24,
  avg_score: 87.6,
  total_time: 23400, // in seconds (6.5 hours)
  last_quiz_date: new Date().toISOString(),
};

export const useUserStats = (userId: string | null) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setStats(MOCK_USER_STATS);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (docSnap) => {
        if (docSnap.exists()) {
          setStats(docSnap.data());
        } else {
          // Use mock data as fallback
          setStats(MOCK_USER_STATS);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching user stats:', err);
        // Use mock data on error
        setStats(MOCK_USER_STATS);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { stats, loading, error };
};

const MOCK_QUIZZES = [
  {
    quiz_id: '1',
    title: 'Mathematics Fundamentals',
    description: 'Test your basic math skills including algebra, geometry, and arithmetic',
    category: 'Mathematics',
    difficulty: 'Medium',
    time_limit: 30,
    questions: Array(15).fill({}),
    created_at: new Date().toISOString(),
  },
  {
    quiz_id: '2',
    title: 'General Science Quiz',
    description: 'Comprehensive science knowledge test covering physics, chemistry, and biology',
    category: 'Science',
    difficulty: 'Hard',
    time_limit: 45,
    questions: Array(20).fill({}),
    created_at: new Date().toISOString(),
  },
  {
    quiz_id: '3',
    title: 'World History Trivia',
    description: 'Explore major events and figures from world history',
    category: 'History',
    difficulty: 'Easy',
    time_limit: 20,
    questions: Array(10).fill({}),
    created_at: new Date().toISOString(),
  },
  {
    quiz_id: '4',
    title: 'English Literature',
    description: 'Test your knowledge of classic literature and authors',
    category: 'Literature',
    difficulty: 'Medium',
    time_limit: 35,
    questions: Array(18).fill({}),
    created_at: new Date().toISOString(),
  },
  {
    quiz_id: '5',
    title: 'Advanced Physics',
    description: 'Challenge yourself with advanced physics concepts',
    category: 'Science',
    difficulty: 'Hard',
    time_limit: 50,
    questions: Array(25).fill({}),
    created_at: new Date().toISOString(),
  },
  {
    quiz_id: '6',
    title: 'Technology Basics',
    description: 'Fundamental concepts in computer science and technology',
    category: 'Technology',
    difficulty: 'Easy',
    time_limit: 25,
    questions: Array(12).fill({}),
    created_at: new Date().toISOString(),
  },
];

export const useQuizzes = (limit: number = 50) => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'quizzes')),
      (snapshot) => {
        if (snapshot.empty) {
          // Use mock data if no data in Firestore
          setQuizzes(MOCK_QUIZZES.slice(0, limit));
        } else {
          const quizzesData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            quiz_id: doc.id,
          }));
          setQuizzes(quizzesData.slice(0, limit));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching quizzes:', err);
        // Use mock data on error
        setQuizzes(MOCK_QUIZZES.slice(0, limit));
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { quizzes, loading, error };
};

const MOCK_ACHIEVEMENTS = [
  {
    achievement_id: 'quiz_master',
    name: 'Quiz Master',
    earned_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 1,
  },
  {
    achievement_id: 'perfect_score',
    name: 'Perfect Score',
    earned_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 0.6,
  },
  {
    achievement_id: 'speed_demon',
    name: 'Speed Demon',
    earned_date: null,
    progress: 0.4,
  },
];

export const useUserAchievements = (userId: string | null) => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setAchievements(MOCK_ACHIEVEMENTS);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'achievements'), where('user_id', '==', userId)),
      (snapshot) => {
        if (snapshot.empty) {
          // Use mock data if no data in Firestore
          setAchievements(MOCK_ACHIEVEMENTS);
        } else {
          const achievementsData = snapshot.docs.map((doc) => ({
            ...doc.data(),
            achievement_id: doc.id,
          }));
          setAchievements(achievementsData);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching achievements:', err);
        // Use mock data on error
        setAchievements(MOCK_ACHIEVEMENTS);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  return { achievements, loading, error };
};

const MOCK_LEADERBOARD = [
  { user_id: '1', name: 'Alice Johnson', total_points: 2850, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
  { user_id: '2', name: 'Bob Smith', total_points: 2650, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' },
  { user_id: '3', name: 'Carol White', total_points: 2480, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol' },
  { user_id: '4', name: 'David Brown', total_points: 2320, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David' },
  { user_id: '5', name: 'Eve Wilson', total_points: 2150, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eve' },
  { user_id: '6', name: 'Frank Miller', total_points: 2000, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Frank' },
  { user_id: '7', name: 'Grace Lee', total_points: 1890, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Grace' },
  { user_id: '8', name: 'Henry Davis', total_points: 1750, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Henry' },
  { user_id: '9', name: 'Iris Martinez', total_points: 1620, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Iris' },
  { user_id: '10', name: 'Jack Taylor', total_points: 1450, profile_pic: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack' },
];

export const useLeaderboard = (limit: number = 10) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'leaderboard')),
      (snapshot) => {
        if (snapshot.empty) {
          // Use mock data if no data in Firestore
          const mockData = MOCK_LEADERBOARD.slice(0, limit).map((user, index) => ({
            ...user,
            rank: index + 1,
          }));
          setLeaderboard(mockData);
        } else {
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
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching leaderboard:', err);
        // Use mock data on error
        const mockData = MOCK_LEADERBOARD.slice(0, limit).map((user, index) => ({
          ...user,
          rank: index + 1,
        }));
        setLeaderboard(mockData);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [limit]);

  return { leaderboard, loading, error };
};
