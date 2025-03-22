
import { supabase } from '@/lib/supabase';

/**
 * Initialise la table des amis
 */
export const initializeAmisTable = async (): Promise<boolean> => {
  try {
    // Vérifie si la table existe déjà
    const { data, error } = await supabase
      .from('amis')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // La table n'existe pas, on doit la créer
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.amis (
          id SERIAL PRIMARY KEY,
          user_id UUID NOT NULL,
          ami_id UUID NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { error: createError } = await supabase.rpc('exec_sql', {
        query: createTableQuery
      });

      if (createError) {
        console.error('Erreur lors de la création de la table amis:', createError);
        return false;
      }

      console.log('Table amis créée avec succès');
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table amis:', error);
      return false;
    }

    console.log('Table amis vérifiée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la table amis:', error);
    return false;
  }
};

export * from './enrichirAmis';
export * from './accepterDemande';
export * from './envoyerDemande';
export * from './fetchAmis';
export * from './rejeterDemande';
export * from './types';
export * from './userEmail';
