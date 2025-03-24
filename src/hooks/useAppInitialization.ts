import { useState, useEffect, useCallback } from 'react';
import { checkSupabaseConnection, initializeDatabaseTables } from '@/lib/supabase';
import { initializeCategories } from '@/services/categorieService';
import { initializeVoteTables } from "@/services/database/voteTables";

export const useAppInitialization = () => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const initialize = async () => {
      try {
        setInitializing(true);
        console.log('Initialisation de l\'application...');
        
        // Vérifier la connexion à Supabase
        const connected = await checkSupabaseConnection();
        console.log('Connexion à Supabase:', connected ? 'OK' : 'Échouée');
        
        if (!connected) {
          setError('Impossible de se connecter à la base de données');
          setInitializing(false);
          return;
        }
        
        // Initialiser les tables si nécessaire
        await initializeDatabaseTables();
        
        // Initialiser les catégories
        await initializeCategories();
        
        // Initialiser les tables de vote
        await initializeVoteTables().catch(err => {
          console.error("Erreur lors de l'initialisation des tables de vote:", err);
        });
        
        setInitialized(true);
        console.log('Initialisation terminée avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        setError('Une erreur est survenue lors de l\'initialisation');
      } finally {
        setInitializing(false);
      }
    };
    
    initialize();
  }, []);
  
  return { initialized, initializing, error };
};
