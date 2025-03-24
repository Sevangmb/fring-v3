
import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";

/**
 * Vérifier et créer la table ensemble_votes si elle n'existe pas
 */
export const ensureEnsembleVotesTable = async (): Promise<boolean> => {
  try {
    // Vérifier si la table existe
    const { error: checkError } = await supabase.from('ensemble_votes').select('id').limit(1);
    
    // Si la table n'existe pas (erreur 42P01), la créer
    if (checkError && checkError.code === '42P01') {
      console.log("Création de la table ensemble_votes");
      
      const { error: createError } = await supabase.rpc('create_table', { 
        table_name: 'ensemble_votes',
        columns: `
          id SERIAL PRIMARY KEY,
          ensemble_id INTEGER NOT NULL REFERENCES tenues(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          vote TEXT NOT NULL CHECK (vote IN ('up', 'down')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(ensemble_id, user_id)
        `
      });
      
      if (createError) {
        console.error("Erreur lors de la création de la table ensemble_votes:", createError);
        return false;
      }
      
      return true;
    }
    
    // La table existe déjà
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification/création de la table ensemble_votes:", error);
    return false;
  }
};

/**
 * Mettre à jour la structure de la table defi_votes pour permettre les votes directs sur les défis
 */
export const updateDefiVotesTable = async (): Promise<boolean> => {
  try {
    // Vérifier si la table existe
    const { error: checkError } = await supabase.from('defi_votes').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Si la table n'existe pas, la créer avec ensemble_id optionnel
      console.log("Création de la table defi_votes");
      
      const { error: createError } = await supabase.rpc('create_table', { 
        table_name: 'defi_votes',
        columns: `
          id SERIAL PRIMARY KEY,
          defi_id INTEGER NOT NULL REFERENCES defis(id) ON DELETE CASCADE,
          ensemble_id INTEGER REFERENCES tenues(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          vote TEXT NOT NULL CHECK (vote IN ('up', 'down')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          UNIQUE(defi_id, ensemble_id, user_id)
        `
      });
      
      if (createError) {
        console.error("Erreur lors de la création de la table defi_votes:", createError);
        return false;
      }
      
      return true;
    } else {
      // Si la table existe, vérifions si ensemble_id permet des valeurs NULL
      // Essayons d'insérer une ligne avec ensemble_id NULL pour voir
      const testUserId = "00000000-0000-0000-0000-000000000000"; // UUID fictif pour le test
      
      // Première tentative d'insertion avec ensemble_id NULL
      const { error: insertError } = await supabase.from('defi_votes').insert({
        defi_id: -1, // ID fictif pour le test
        user_id: testUserId,
        vote: 'up',
        ensemble_id: null
      }).select();
      
      // Si l'erreur est liée à la contrainte NOT NULL, il faut modifier la table
      if (insertError && insertError.message.includes('violates not-null constraint')) {
        console.log("Modification de la colonne ensemble_id pour permettre les valeurs NULL");
        
        try {
          // Supprimer les contraintes existantes, car on ne peut pas les modifier directement
          await supabase.rpc('exec_sql', {
            query: `
              ALTER TABLE defi_votes
              DROP CONSTRAINT IF EXISTS defi_votes_ensemble_id_fkey;
            `
          });
          
          // Modifier la colonne pour permettre les valeurs NULL
          await supabase.rpc('exec_sql', {
            query: `
              ALTER TABLE defi_votes
              ALTER COLUMN ensemble_id DROP NOT NULL;
            `
          });
          
          // Recréer la contrainte de clé étrangère
          await supabase.rpc('exec_sql', {
            query: `
              ALTER TABLE defi_votes
              ADD CONSTRAINT defi_votes_ensemble_id_fkey
              FOREIGN KEY (ensemble_id) REFERENCES tenues(id) ON DELETE CASCADE;
            `
          });
          
          // Mettre à jour la contrainte d'unicité
          await supabase.rpc('exec_sql', {
            query: `
              ALTER TABLE defi_votes
              DROP CONSTRAINT IF EXISTS defi_votes_defi_id_ensemble_id_user_id_key;
              
              ALTER TABLE defi_votes
              ADD CONSTRAINT defi_votes_defi_id_ensemble_id_user_id_key 
              UNIQUE (defi_id, ensemble_id, user_id);
            `
          });
          
          return true;
        } catch (error) {
          console.error("Erreur lors de la modification de la table defi_votes:", error);
          return false;
        }
      }
      
      // Si l'erreur est autre, nettoyons la ligne de test
      if (insertError && insertError.code !== '23505') { // Ignorer l'erreur d'unicité
        console.error("Erreur de test de la table defi_votes:", insertError);
      } else {
        // Nettoyer la ligne de test si elle a été insérée
        await supabase.from('defi_votes').delete().eq('defi_id', -1);
      }
      
      return true;
    }
  } catch (error) {
    console.error("Erreur lors de la vérification/modification de la table defi_votes:", error);
    return false;
  }
};

export const initializeVoteTables = async (): Promise<boolean> => {
  try {
    const ensembleTableResult = await fetchWithRetry(() => ensureEnsembleVotesTable(), 3);
    const defiTableResult = await fetchWithRetry(() => updateDefiVotesTable(), 3);
    
    return ensembleTableResult && defiTableResult;
  } catch (error) {
    console.error("Erreur lors de l'initialisation des tables de vote:", error);
    return false;
  }
};
