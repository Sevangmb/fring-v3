
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { setupLogInterceptors } from '@/services/logs';

export const useAppInitialization = () => {
  const { user, setUser, signOut } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      try {
        // Set up log interceptors
        setupLogInterceptors();

        // Check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          return;
        }
        
        if (data?.session?.user) {
          setUser(data.session.user);
        }
        
        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              setUser(session.user);
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
            }
          }
        );
        
        // Cleanup subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    // Call the initialize function directly
    initialize();
  }, [setUser, signOut]);
};
