
import { supabase } from '@/lib/supabase';
import { checkTableExists } from './connection';
import { createTable } from './tableOperations';

/**
 * Initializes the database by creating necessary tables if they don't exist
 */
export const initializeDatabase = async () => {
  try {
    // Vérifie si la table existe déjà
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') { // Table doesn't exist
      console.log('La table vetements n\'existe pas. Création en cours...');
      
      // Créer la table directement avec l'API Supabase
      const { error: createError } = await supabase.rpc(
        'create_table',
        {
          table_name: 'vetements',
          columns: `
            id SERIAL PRIMARY KEY,
            nom VARCHAR(255) NOT NULL,
            categorie VARCHAR(50) NOT NULL,
            couleur VARCHAR(50) NOT NULL,
            taille VARCHAR(20) NOT NULL,
            description TEXT,
            marque VARCHAR(100),
            image_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
            user_id UUID REFERENCES auth.users(id)
          `
        }
      );
      
      if (createError) {
        console.error('Erreur lors de la création de la table:', createError);
        
        // Si nous ne pouvons pas créer dynamiquement, avertir l'utilisateur
        console.log('Impossible de créer la table automatiquement. Utilisation des données de démo.');
        return false;
      }
      
      console.log('Table vetements créée avec succès!');
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table:', error);
      return false;
    } else {
      console.log('La table vetements existe déjà.');
      return true;
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    return false;
  }
};
