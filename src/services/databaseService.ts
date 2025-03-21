
import { supabase } from '@/lib/supabase';

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

// Fonction pour initialiser la base de données
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

// Fonction pour attribuer tous les vêtements existants à un utilisateur spécifique
export const assignVetementsToUser = async (userEmail: string): Promise<boolean> => {
  try {
    // Récupérer l'ID de l'utilisateur à partir de son email en utilisant la fonction SQL
    const { data: userId, error: userError } = await supabase.rpc('get_user_id_by_email', {
      email_param: userEmail
    });
    
    if (userError) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', userError);
      return false;
    }
    
    if (!userId) {
      console.error('Utilisateur non trouvé:', userEmail);
      return false;
    }
    
    console.log('ID de l\'utilisateur récupéré:', userId);
    
    // Utiliser la fonction RPC pour attribuer tous les vêtements sans propriétaire à cet utilisateur
    const { data: affectedRows, error: updateError } = await supabase.rpc('assign_all_clothes_to_user', {
      target_user_id: userId
    });
    
    if (updateError) {
      console.error('Erreur lors de l\'attribution des vêtements:', updateError);
      return false;
    }
    
    console.log(`Vêtements ont été attribués à l'utilisateur ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'attribution des vêtements:', error);
    return false;
  }
};

// Fonction pour créer un bucket de stockage si nécessaire - Désactivée à cause des problèmes de RLS
export const createStorageBucket = async () => {
  console.log('Création du bucket désactivée pour éviter les erreurs RLS');
  return false;
};

// Fonction pour créer la table directement depuis l'application
export const createVetementsTable = async () => {
  try {
    // Utilisation de l'API SQL de Supabase pour créer la table directement
    const { error } = await supabase.from('vetements').select('count').limit(1);
    
    if (error && error.code === '42P01') {
      // La table n'existe pas, essayons de la créer
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS public.vetements (
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
        );
        ALTER TABLE public.vetements ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view their own vetements" 
        ON public.vetements 
        FOR SELECT 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can insert their own vetements" 
        ON public.vetements 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own vetements" 
        ON public.vetements 
        FOR UPDATE 
        USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own vetements" 
        ON public.vetements 
        FOR DELETE 
        USING (auth.uid() = user_id);
      `;
      
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        query: createTableQuery
      });
      
      if (sqlError) {
        console.error('Erreur SQL lors de la création de la table:', sqlError);
        return false;
      }
      
      return true;
    } else if (error) {
      console.error('Erreur lors de la vérification de la table:', error);
      return false;
    }
    
    // La table existe déjà
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la table:', error);
    return false;
  }
};
