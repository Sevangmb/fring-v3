
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { setupAllLogInterceptors } from '@/services/logsService';

/**
 * Hook pour initialiser l'application et configurer les services nécessaires
 */
export const useAppInitialization = () => {
  const { user, setUser } = useAuth();

  useEffect(() => {
    // Configurer les intercepteurs de logs
    const cleanupLogs = setupAllLogInterceptors();
    console.info('Initialisation de l\'application...', { userId: user?.id });

    // Écouter les changements d'authentification Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.info('Changement d\'état d\'authentification:', event);
      setUser(session?.user || null);
    });

    // Nettoyage au démontage
    return () => {
      authListener.subscription.unsubscribe();
      cleanupLogs();
    };
  }, [setUser, user?.id]);

  return {
    initialized: true
  };
};

export default useAppInitialization;
