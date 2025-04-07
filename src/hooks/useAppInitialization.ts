
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { writeLog } from '@/services/logs';
import { initializeLogsSystem } from '@/services/logsService';
import { checkEnsembleUserIdColumn, addUserIdToEnsembles } from '@/services/database/ensembleInitialization';

export const useAppInitialization = () => {
  const { user } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialiser d'abord le système de logs
        await initializeLogsSystem();
        
        if (user) {
          console.log("Initialisation de l'application pour l'utilisateur:", user.id);
          
          // Vérifier si la structure des ensembles est correcte
          const hasUserIdColumn = await checkEnsembleUserIdColumn();
          
          if (!hasUserIdColumn) {
            console.log("Ajout de la colonne user_id à la table tenues");
            await addUserIdToEnsembles();
          }
          
          // Log d'initialisation réussie
          await writeLog(
            `Application initialisée pour l'utilisateur ${user.email}`, 
            'info', 
            `User ID: ${user.id}`, 
            'initialization'
          );
        }
        
        setInitialized(true);
      } catch (err) {
        console.error("Erreur lors de l'initialisation de l'application:", err);
        setError(err instanceof Error ? err : new Error('Erreur d\'initialisation inconnue'));
        
        // Log d'erreur d'initialisation
        try {
          await writeLog(
            "Erreur d'initialisation de l'application", 
            'error', 
            err instanceof Error ? err.message : 'Erreur inconnue', 
            'initialization'
          );
        } catch (logError) {
          console.error("Impossible d'écrire le log d'erreur:", logError);
        }
      }
    };
    
    initializeApp();
  }, [user]);
  
  return { initialized, error };
};
