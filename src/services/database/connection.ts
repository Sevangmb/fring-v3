
import { supabase } from '@/lib/supabase';

/**
 * Checks if a table exists in the database
 */
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

/**
 * Checks if a SQL function exists in the database
 */
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

/**
 * Checks if the connection to Supabase is established
 */
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
