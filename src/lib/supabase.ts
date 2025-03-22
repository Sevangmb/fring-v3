
import { createClient } from '@supabase/supabase-js'

// Configuration des variables Supabase
const supabaseUrl = 'https://scogbjfwcpdwzkeejgsx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjb2diamZ3Y3Bkd3prZWVqZ3N4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NDQ3NDUsImV4cCI6MjA1ODEyMDc0NX0.vTGxoFGFUrUW0eO5_vbTZgPhSTWKXPL5vrwY4bZt_YU'

// Création du client Supabase avec une configuration explicite
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: localStorage
  },
})

// Log pour confirmer l'initialisation
console.log('Client Supabase initialisé avec succès')

// Fonction pour vérifier si une table existe
export const checkTableExists = async (tableName: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from(tableName).select('count').limit(1);
    
    if (error && error.code === '42P01') {
      // Table doesn't exist
      return false;
    } else if (error) {
      console.error(`Erreur lors de la vérification de la table ${tableName}:`, error);
      return false;
    }
    
    // Table exists
    return true;
  } catch (error) {
    console.error(`Erreur lors de la vérification de la table ${tableName}:`, error);
    return false;
  }
};

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

// Fonction pour vérifier si une fonction SQL existe
export const checkFunctionExists = async (functionName: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc(functionName);
    
    // Si l'erreur est "fonction non trouvée", elle n'existe pas
    if (error && error.code === 'PGRST202') {
      return false;
    }
    
    // La fonction existe (même si nous avons une autre erreur, c'est qu'elle existe)
    return true;
  } catch (error) {
    // Une erreur peut signifier que la fonction existe mais a échoué pour d'autres raisons
    console.error(`Erreur lors de la vérification de la fonction ${functionName}:`, error);
    return false;
  }
};

// Fonction pour récupérer l'identifiant d'un utilisateur par son email
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    // Utiliser la fonction RPC pour exécuter une requête SQL custom
    const { data, error } = await supabase.rpc('get_user_id_by_email', {
      email_param: email
    });
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    return null;
  }
};

// Fonction pour attribuer tous les vêtements à un utilisateur spécifique
export const assignAllClothesToUser = async (userId: string): Promise<boolean> => {
  try {
    // Utiliser la fonction RPC pour exécuter une mise à jour
    const { error } = await supabase.rpc('assign_all_clothes_to_user', {
      target_user_id: userId
    });
    
    if (error) {
      console.error('Erreur lors de l\'attribution des vêtements:', error);
      return false;
    }
    
    console.log('Vêtements attribués avec succès à l\'utilisateur ID:', userId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'attribution des vêtements:', error);
    return false;
  }
};

// Fonction pour vérifier la connexion à Supabase
export const checkSupabaseConnection = async () => {
  try {
    // Vérifie si la connexion à Supabase est établie
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return false;
    }
    
    // Vérifie si la table vetements existe
    const tableExists = await checkTableExists('vetements');
    
    if (!tableExists) {
      console.warn('La table vetements n\'existe pas encore');
    }
    
    // Vérifie si les fonctions nécessaires existent
    const createTableFunctionExists = await checkFunctionExists('create_table');
    const execSqlFunctionExists = await checkFunctionExists('exec_sql');
    
    if (!createTableFunctionExists || !execSqlFunctionExists) {
      console.warn('Les fonctions SQL nécessaires ne sont pas toutes disponibles');
      console.warn('Veuillez exécuter le script SQL dans l\'interface Supabase');
    }
    
    console.log('Connexion à Supabase établie avec succès');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à Supabase:', error);
    return false;
  }
};
