
import { supabase } from '@/lib/supabase';
import { Vetement } from '@/services/vetement/types';

/**
 * Interface for database statistics
 */
export interface DatabaseStats {
  totalUsers: number;
  totalVetements: number;
  totalEnsembles: number;
  totalCategories: number;
  latestRegistrations: {
    email: string;
    updated_at: string;
  }[];
  tableCounts: Record<string, number>;
}

/**
 * Récupère les statistiques de la base de données pour l'administration
 */
export const getDatabaseStats = async (): Promise<DatabaseStats> => {
  try {
    // Vérifier si l'utilisateur est authentifié et est un admin
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    const userEmail = sessionData.session?.user?.email;
    
    if (!userId || !userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    
    // Vérifier si l'utilisateur est un administrateur
    const adminEmails = ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
    if (!adminEmails.includes(userEmail)) {
      throw new Error('Accès non autorisé');
    }
    
    // Récupérer le nombre total d'utilisateurs
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (usersError) throw usersError;
    
    // Récupérer le nombre total de vêtements
    const { count: totalVetements, error: vetementsError } = await supabase
      .from('vetements')
      .select('*', { count: 'exact', head: true });
    
    if (vetementsError) throw vetementsError;
    
    // Récupérer le nombre total d'ensembles
    const { count: totalEnsembles, error: ensemblesError } = await supabase
      .from('tenues')
      .select('*', { count: 'exact', head: true });
    
    if (ensemblesError) throw ensemblesError;
    
    // Récupérer le nombre total de catégories
    const { count: totalCategories, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    if (categoriesError) throw categoriesError;
    
    // Récupérer les dernières inscriptions (10 derniers utilisateurs)
    const { data: latestUsers, error: latestUsersError } = await supabase
      .from('profiles')
      .select('email, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10);
    
    if (latestUsersError) throw latestUsersError;
    
    // Obtenir le nombre d'enregistrements dans chaque table
    const tables = ['vetements', 'tenues', 'categories', 'profiles', 'amis', 'tenues_vetements'];
    const tableCounts: Record<string, number> = {};
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`Erreur lors du comptage de la table ${table}:`, error);
        tableCounts[table] = 0;
      } else {
        tableCounts[table] = count || 0;
      }
    }
    
    return {
      totalUsers: totalUsers || 0,
      totalVetements: totalVetements || 0,
      totalEnsembles: totalEnsembles || 0,
      totalCategories: totalCategories || 0,
      latestRegistrations: latestUsers || [],
      tableCounts
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques de la base de données:', error);
    throw error;
  }
};

/**
 * Récupère tous les vêtements de tous les utilisateurs pour l'administration
 */
export const getAllVetements = async (): Promise<Vetement[]> => {
  try {
    // Vérifier si l'utilisateur est authentifié et est un admin
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    const userEmail = sessionData.session?.user?.email;
    
    if (!userId || !userEmail) {
      throw new Error('Utilisateur non authentifié');
    }
    
    // Vérifier si l'utilisateur est un administrateur
    const adminEmails = ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
    if (!adminEmails.includes(userEmail)) {
      throw new Error('Accès non autorisé');
    }
    
    // Récupérer tous les vêtements avec les informations du propriétaire
    const { data, error } = await supabase
      .from('vetements')
      .select(`
        *,
        profiles:user_id(email)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

/**
 * Compte le nombre total de vêtements dans la base de données
 */
export const getTotalVetementsCount = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('vetements')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Erreur lors du comptage des vêtements:', error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des vêtements:', error);
    return 0;
  }
};

/**
 * Récupère les vêtements qui n'ont pas de propriétaire
 */
export const getVetementsWithoutOwner = async (): Promise<Vetement[]> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .is('user_id', null);
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements sans propriétaire:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements sans propriétaire:', error);
    return [];
  }
};

/**
 * Récupère les vêtements pour un utilisateur spécifique
 */
export const getVetementsByUser = async (userId: string): Promise<Vetement[]> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Erreur lors de la récupération des vêtements de l\'utilisateur:', error);
      throw error;
    }
    
    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements de l\'utilisateur:', error);
    return [];
  }
};
