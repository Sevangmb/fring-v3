
import { supabase } from './client'
import { checkTableExists, checkFunctionExists, checkSupabaseConnection } from './connection'

// Function to initialize database tables
export const initializeDatabaseTables = async (): Promise<boolean> => {
  try {
    console.log('Initialisation des tables de la base de données...');
    
    // Check and create categories table if needed
    const categoriesTableExists = await checkTableExists('categories');
    if (!categoriesTableExists) {
      console.log('La table categories n\'existe pas encore, création en cours...');
      const createCategoriesQuery = `
        CREATE TABLE IF NOT EXISTS categories (
          id SERIAL PRIMARY KEY,
          nom VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createCategoriesQuery });
      if (createError) {
        console.error('Erreur lors de la création de la table categories:', createError);
        return false;
      }
      console.log('Table categories créée avec succès');
    } else {
      console.log('Table categories existe déjà');
    }
    
    // Check and create vetements table if needed
    const vetementsTableExists = await checkTableExists('vetements');
    if (!vetementsTableExists) {
      console.log('La table vetements n\'existe pas encore, création en cours...');
      const createVetementsQuery = `
        CREATE TABLE IF NOT EXISTS vetements (
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
          owner_email VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          FOREIGN KEY (categorie_id) REFERENCES categories(id)
        );
      `;
      
      const { error: createError } = await supabase.rpc('exec_sql', { query: createVetementsQuery });
      if (createError) {
        console.error('Erreur lors de la création de la table vetements:', createError);
        return false;
      }
      console.log('Table vetements créée avec succès');
    } else {
      console.log('Table vetements existe déjà');
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation des tables:', error);
    return false;
  }
};
