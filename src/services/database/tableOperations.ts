
import { supabase } from '@/lib/supabase';
import { checkTableExists } from './connection';

/**
 * Creates a database table using a custom SQL function
 */
export const createTable = async (tableName: string, columns: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('create_table', {
      table_name: tableName,
      columns: columns
    });
    
    if (error) {
      console.error(`Erreur lors de la création de la table ${tableName}:`, error);
      return false;
    }
    
    console.log(`Table ${tableName} créée avec succès`);
    return true;
  } catch (error) {
    console.error(`Erreur lors de la création de la table ${tableName}:`, error);
    return false;
  }
};

/**
 * Executes a custom SQL query
 */
export const executeSQL = async (query: string): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc('exec_sql', {
      query: query
    });
    
    if (error) {
      console.error('Erreur lors de l\'exécution du SQL:', error);
      return false;
    }
    
    console.log('SQL exécuté avec succès');
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'exécution du SQL:', error);
    return false;
  }
};

/**
 * Creates a storage bucket (disabled due to RLS issues)
 */
export const createStorageBucket = async () => {
  console.log('Création du bucket désactivée pour éviter les erreurs RLS');
  return false;
};

/**
 * Creates the vetements table with proper structure and RLS policies
 */
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
