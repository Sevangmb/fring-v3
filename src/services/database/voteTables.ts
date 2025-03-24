
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
 * Check and update defi_votes table to allow null ensemble_id
 */
export const updateDefiVotesTable = async (): Promise<boolean> => {
  try {
    // First, check if the table exists
    const { error: checkError } = await supabase.from('defi_votes').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      // Create the table with nullable ensemble_id if it doesn't exist
      console.log("Creating defi_votes table with nullable ensemble_id");
      
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
        console.error("Error creating defi_votes table:", createError);
        return false;
      }
      
      return true;
    } else {
      // If the table exists, check if ensemble_id is nullable
      // Try to insert a test record with null ensemble_id
      const testUserId = "00000000-0000-0000-0000-000000000000"; // Test UUID
      
      const { error: insertError } = await supabase.from('defi_votes').insert({
        defi_id: -1, // Test ID
        ensemble_id: null,
        user_id: testUserId,
        vote: 'up'
      });
      
      // If we get a not-null constraint violation, we need to modify the table
      if (insertError && insertError.message.includes('violates not-null constraint')) {
        console.log("Updating defi_votes table to allow null ensemble_id");
        
        // Execute a raw SQL command to alter the table
        const { error: alterError } = await supabase.rpc('exec_sql', {
          query: `
            -- First drop any foreign key constraint
            ALTER TABLE defi_votes DROP CONSTRAINT IF EXISTS defi_votes_ensemble_id_fkey;
            
            -- Then modify the column to allow nulls
            ALTER TABLE defi_votes ALTER COLUMN ensemble_id DROP NOT NULL;
            
            -- Add the foreign key constraint back
            ALTER TABLE defi_votes 
            ADD CONSTRAINT defi_votes_ensemble_id_fkey 
            FOREIGN KEY (ensemble_id) 
            REFERENCES tenues(id) ON DELETE CASCADE;
            
            -- Update unique constraint
            ALTER TABLE defi_votes DROP CONSTRAINT IF EXISTS defi_votes_defi_id_ensemble_id_user_id_key;
            ALTER TABLE defi_votes ADD CONSTRAINT defi_votes_defi_id_ensemble_id_user_id_key 
            UNIQUE (defi_id, ensemble_id, user_id);
          `
        });
        
        if (alterError) {
          console.error("Error updating defi_votes table:", alterError);
          return false;
        }
        
        console.log("Successfully updated defi_votes table");
        return true;
      } else if (insertError && insertError.code !== '23505') {
        // If we get an error other than duplicate key, something is wrong
        console.error("Error testing defi_votes table:", insertError);
        return false;
      } else {
        // Clean up test record if it was inserted
        await supabase.from('defi_votes').delete().eq('defi_id', -1);
        console.log("defi_votes table already allows null ensemble_id");
        return true;
      }
    }
  } catch (error) {
    console.error("Error checking/updating defi_votes table:", error);
    return false;
  }
};

/**
 * Initialize all vote tables
 */
export const initializeVoteTables = async (): Promise<boolean> => {
  try {
    console.log("Initializing vote tables...");
    const ensembleResult = await fetchWithRetry(() => ensureEnsembleVotesTable(), 3);
    const defiResult = await fetchWithRetry(() => updateDefiVotesTable(), 3);
    
    if (ensembleResult && defiResult) {
      console.log("Vote tables initialization successful");
      return true;
    } else {
      console.error("Vote tables initialization failed");
      return false;
    }
  } catch (error) {
    console.error("Error initializing vote tables:", error);
    return false;
  }
};
