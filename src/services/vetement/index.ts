
import { supabase } from '@/lib/supabase';

/**
 * Initialise la table des vêtements
 */
export const initializeVetements = async (): Promise<boolean> => {
  try {
    // Vérifie si la table existe déjà
    const { data, error } = await supabase
      .from('vetements')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') {
      // La table n'existe pas, on doit la créer
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.vetements (
          id SERIAL PRIMARY KEY,
          nom VARCHAR(255) NOT NULL,
          categorie_id INTEGER NOT NULL,
          couleur VARCHAR(100) NOT NULL,
          taille VARCHAR(50) NOT NULL,
          marque VARCHAR(100),
          description TEXT,
          image_url TEXT,
          temperature VARCHAR(50),
          weather_type VARCHAR(50),
          user_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;

      const { error: createError } = await supabase.rpc('exec_sql', {
        query: createTableQuery
      });

      if (createError) {
        console.error('Erreur lors de la création de la table vetements:', createError);
        return false;
      }

      console.log('Table vetements créée avec succès');
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table vetements:', error);
      return false;
    }

    console.log('Table vetements vérifiée avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la table vetements:', error);
    return false;
  }
};

export * from './addVetement';
export * from './deleteVetement';
export * from './fetchVetements';
export * from './updateVetement';
export * from './types';
export * from './demoVetements';

// Re-export the fetchVetements function as the default export
export { fetchVetements as default } from './fetchVetements';
