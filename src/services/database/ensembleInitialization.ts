
import { supabase } from '@/lib/supabase';

/**
 * Vérifie si la colonne user_id existe dans la table tenues
 */
export const checkEnsembleUserIdColumn = async (): Promise<boolean> => {
  try {
    // Vérifier si la colonne existe déjà
    const { data, error } = await supabase
      .rpc('exec_sql', {
        query: `
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'tenues' 
          AND column_name = 'user_id'
        `
      });

    if (error) {
      console.error("Erreur lors de la vérification de la colonne user_id:", error);
      return false;
    }

    return (data && data.length > 0);
  } catch (error) {
    console.error("Erreur lors de la vérification de la colonne user_id:", error);
    return false;
  }
};

/**
 * Ajoute la colonne user_id à la table tenues si elle n'existe pas
 */
export const addUserIdToEnsembles = async (): Promise<boolean> => {
  try {
    const columnExists = await checkEnsembleUserIdColumn();
    
    if (!columnExists) {
      const { error } = await supabase
        .rpc('exec_sql', {
          query: `
            ALTER TABLE public.tenues 
            ADD COLUMN user_id UUID REFERENCES auth.users(id);
          `
        });

      if (error) {
        console.error("Erreur lors de l'ajout de la colonne user_id:", error);
        return false;
      }
      
      console.log("Colonne user_id ajoutée à la table tenues");
      return true;
    }
    
    console.log("La colonne user_id existe déjà dans la table tenues");
    return true;
  } catch (error) {
    console.error("Erreur lors de l'ajout de la colonne user_id:", error);
    return false;
  }
};

/**
 * Initialise la structure de données pour les ensembles
 */
export const initializeEnsembleData = async (): Promise<void> => {
  try {
    await addUserIdToEnsembles();
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données d'ensemble:", error);
  }
};
