import { useState, useCallback } from 'react';
import * as firebaseService from '../services/firebaseService';
import { User, Quiz, QuizResponse, LeaderboardEntry } from '../types';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userId: string, userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseService.createUserProfile(userId, userData);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.getUserProfile(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get user';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      await firebaseService.updateUserProfile(userId, updates);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update user';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const createQuiz = useCallback(async (quizData: Partial<Quiz>) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.createQuiz(quizData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create quiz';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuiz = useCallback(async (quizId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.getQuiz(quizId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get quiz';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserQuizzes = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.getUserQuizzes(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get quizzes';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getAllQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.getAllQuizzes();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get quizzes';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const submitResponse = useCallback(async (response: QuizResponse) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.submitQuizResponse(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit response';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserResponses = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      return await firebaseService.getUserQuizResponses(userId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get responses';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createUser,
    getUser,
    updateUser,
    createQuiz,
    getQuiz,
    getUserQuizzes,
    getAllQuizzes,
    submitResponse,
    getUserResponses,
  };
};
