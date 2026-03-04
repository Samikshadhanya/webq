import { useState, useEffect, useCallback } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuthStore } from '../store/authStore';
import { getUserProfile, createUserProfile } from '../services/firebaseService';
import { User } from '../types';

export const useAuth = () => {
  const { user, isAuthenticated, setUser, logout: logoutStore } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(true);

      if (fbUser) {
        try {
          // Check if user profile exists
          let userProfile = await getUserProfile(fbUser.uid);

          // Create profile if it doesn't exist
          if (!userProfile) {
            const newProfile: Partial<User> = {
              email: fbUser.email || '',
              name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
              profile_pic: fbUser.photoURL || '',
              role: 'student',
            };
            await createUserProfile(fbUser.uid, newProfile);
            userProfile = await getUserProfile(fbUser.uid);
          }

          if (userProfile) {
            setUser(userProfile);
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      logoutStore();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, [logoutStore]);

  return {
    user,
    firebaseUser,
    isAuthenticated,
    loading,
    logout,
  };
};
