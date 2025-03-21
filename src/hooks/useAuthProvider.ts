
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  signOutUser,
  initializeAuthSession,
  setupAuthListener
} from '@/utils/authUtils';

export const useAuthProvider = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    console.log("AuthProvider initializing...");
    
    // Set up session
    const initializeAuth = async () => {
      const { session, error } = await initializeAuthSession();
      if (!error) {
        setSession(session);
        setUser(session?.user ?? null);
      }
      setLoading(false);
    };

    // Set up auth state listener
    const subscription = setupAuthListener((newUser, newSession) => {
      setUser(newUser);
      setSession(newSession);
      setLoading(false);
    });

    // Initialize auth
    initializeAuth();

    // Cleanup function
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const clearUserState = () => {
    setUser(null);
    setSession(null);
  };

  const signIn = async (email: string, password: string) => {
    return signInWithEmailPassword(email, password, toast);
  };

  const signUp = async (email: string, password: string, name: string) => {
    return signUpWithEmailPassword(email, password, name, toast);
  };

  const signOut = async () => {
    return signOutUser(toast, clearUserState);
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut
  };
};
