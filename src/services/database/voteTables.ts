
import { supabase } from '@/lib/supabase';

/**
 * Initialise les tables de vote si elles n'existent pas encore
 */
export const initializeVoteTables = async (): Promise<void> => {
  console.info('Initializing vote tables...');
  try {
    // Vérifier si les tables de votes existent déjà
    await testDefiVotesTable();
  } catch (error) {
    console.error('Vote tables initialization failed', error);
  }
};

/**
 * Teste l'existence de la table defi_votes et la crée si elle n'existe pas
 */
const testDefiVotesTable = async (): Promise<void> => {
  try {
    // Vérifier si la table defi_votes existe
    const { error } = await supabase
      .from('defi_votes')
      .select('defi_id')
      .limit(1);

    // Si la table n'existe pas, la créer
    if (error && error.code === '42P01') {
      await createDefiVotesTable();
    } else if (error) {
      // Si une autre erreur survient, essayer de vérifier si vote_type existe
      // Cela peut indiquer que la table existe mais que vote_type est la colonne à utiliser à la place de vote
      try {
        const { error: testError } = await supabase
          .from('defi_votes')
          .select('vote_type')
          .limit(1);
        
        if (testError) {
          throw testError;
        }
      } catch (testError) {
        console.error('Error testing defi_votes table:', testError);
        await createDefiVotesTable();
      }
    }
  } catch (error) {
    console.error('Error testing defi_votes table:', error);
    throw error;
  }
};

/**
 * Crée la table defi_votes
 */
const createDefiVotesTable = async (): Promise<void> => {
  try {
    // Créer la table defi_votes
    await supabase.rpc('create_table', {
      table_name: 'defi_votes',
      columns: `
        id SERIAL PRIMARY KEY,
        defi_id INTEGER NOT NULL REFERENCES defis(id) ON DELETE CASCADE,
        ensemble_id INTEGER NOT NULL REFERENCES tenues(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(defi_id, ensemble_id, user_id)
      `
    });

    // Ajouter des politiques RLS
    await supabase.rpc('exec_sql', {
      query: `
        ALTER TABLE public.defi_votes ENABLE ROW LEVEL SECURITY;
        
        -- Permettre aux utilisateurs authentifiés de voir les votes
        CREATE POLICY "Allow users to see votes" 
          ON public.defi_votes 
          FOR SELECT 
          USING (auth.role() = 'authenticated');
          
        -- Permettre aux utilisateurs authentifiés d'insérer leurs propres votes
        CREATE POLICY "Allow users to insert their votes" 
          ON public.defi_votes 
          FOR INSERT 
          WITH CHECK (auth.uid() = user_id);
          
        -- Permettre aux utilisateurs authentifiés de mettre à jour leurs propres votes
        CREATE POLICY "Allow users to update their votes" 
          ON public.defi_votes 
          FOR UPDATE 
          USING (auth.uid() = user_id);
      `
    });

    console.log('defi_votes table created successfully');
  } catch (error) {
    console.error('Error creating defi_votes table:', error);
    throw error;
  }
};
