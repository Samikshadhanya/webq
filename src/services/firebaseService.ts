import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  onSnapshot,
  QueryConstraint,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { User, Quiz, QuizResponse, LeaderboardEntry } from '../types';

// User operations
export const createUserProfile = async (userId: string, userData: Partial<User>) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      ...userData,
      user_id: userId,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() ? (userDoc.data() as User) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      last_login: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Quiz operations
export const createQuiz = async (quizData: Partial<Quiz>) => {
  try {
    const quizRef = doc(collection(db, 'quizzes'));
    await setDoc(quizRef, {
      ...quizData,
      quiz_id: quizRef.id,
      created_at: new Date().toISOString(),
      participants: [],
    });
    return quizRef.id;
  } catch (error) {
    console.error('Error creating quiz:', error);
    throw error;
  }
};

export const getQuiz = async (quizId: string): Promise<Quiz | null> => {
  try {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    return quizDoc.exists() ? (quizDoc.data() as Quiz) : null;
  } catch (error) {
    console.error('Error getting quiz:', error);
    throw error;
  }
};

export const getUserQuizzes = async (userId: string): Promise<Quiz[]> => {
  try {
    const q = query(
      collection(db, 'quizzes'),
      where('created_by', '==', userId),
      orderBy('created_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Quiz);
  } catch (error) {
    console.error('Error getting user quizzes:', error);
    throw error;
  }
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  try {
    const q = query(
      collection(db, 'quizzes'),
      orderBy('created_at', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as Quiz);
  } catch (error) {
    console.error('Error getting all quizzes:', error);
    throw error;
  }
};

export const updateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
  try {
    await updateDoc(doc(db, 'quizzes', quizId), updates);
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

export const deleteQuiz = async (quizId: string) => {
  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
  } catch (error) {
    console.error('Error deleting quiz:', error);
    throw error;
  }
};

// Quiz response operations
export const submitQuizResponse = async (response: QuizResponse) => {
  try {
    const responseRef = doc(collection(db, 'quiz_responses'));
    await setDoc(responseRef, {
      ...response,
      completed_at: new Date().toISOString(),
    });
    return responseRef.id;
  } catch (error) {
    console.error('Error submitting quiz response:', error);
    throw error;
  }
};

export const getUserQuizResponses = async (userId: string): Promise<QuizResponse[]> => {
  try {
    const q = query(
      collection(db, 'quiz_responses'),
      where('user_id', '==', userId),
      orderBy('completed_at', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as QuizResponse);
  } catch (error) {
    console.error('Error getting user quiz responses:', error);
    throw error;
  }
};

export const getQuizResponses = async (quizId: string): Promise<QuizResponse[]> => {
  try {
    const q = query(
      collection(db, 'quiz_responses'),
      where('quiz_id', '==', quizId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as QuizResponse);
  } catch (error) {
    console.error('Error getting quiz responses:', error);
    throw error;
  }
};

// Leaderboard operations
export const getTopLeaderboard = async (limit_count: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, 'leaderboard'),
      orderBy('score', 'desc'),
      orderBy('time_taken', 'asc'),
      limit(limit_count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc, index) => ({
      ...(doc.data() as Omit<LeaderboardEntry, 'rank'>),
      rank: index + 1,
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
};

export const subscribeToLeaderboard = (
  limit_count: number = 10,
  callback: (entries: LeaderboardEntry[]) => void
) => {
  const q = query(
    collection(db, 'leaderboard'),
    orderBy('score', 'desc'),
    orderBy('time_taken', 'asc'),
    limit(limit_count)
  );

  return onSnapshot(q, (snapshot) => {
    const entries = snapshot.docs.map((doc, index) => ({
      ...(doc.data() as Omit<LeaderboardEntry, 'rank'>),
      rank: index + 1,
    }));
    callback(entries);
  });
};

// Analytics helper - calculate user stats
export const calculateUserStats = async (userId: string) => {
  try {
    const responses = await getUserQuizResponses(userId);
    
    if (responses.length === 0) {
      return {
        quizzesTaken: 0,
        averageScore: 0,
        totalTime: 0,
      };
    }

    const totalScore = responses.reduce((sum, r) => sum + (r.score || 0), 0);
    const totalTime = responses.reduce((sum, r) => sum + (r.time_taken || 0), 0);

    return {
      quizzesTaken: responses.length,
      averageScore: Math.round(totalScore / responses.length),
      totalTime,
    };
  } catch (error) {
    console.error('Error calculating user stats:', error);
    throw error;
  }
};
