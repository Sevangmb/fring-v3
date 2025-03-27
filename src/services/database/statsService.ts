
import { supabase } from "@/lib/supabase";

/**
 * Interface pour les statistiques de base de données
 */
export interface DatabaseStats {
  tableCounts: Record<string, number>;
  totalUsers: number;
  totalVetements: number;
  totalEnsembles: number;
  totalCategories: number;
  latestRegistrations: {
    email: string;
    created_at: string;
  }[];
}

/**
 * Récupère les statistiques de la base de données
 */
export const getDatabaseStats = async (): Promise<DatabaseStats> => {
  try {
    // Récupération du nombre d'éléments dans différentes tables
    const [
      { count: usersCount, error: usersError },
      { count: vetementsCount, error: vetementsError },
      { count: ensemblesCount, error: ensemblesError },
      { count: categoriesCount, error: categoriesError },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('vetements').select('*', { count: 'exact', head: true }),
      supabase.from('tenues').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
    ]);

    // Récupération des dernières inscriptions
    const { data: latestUsers, error: latestUsersError } = await supabase
      .from('profiles')
      .select('email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (usersError || vetementsError || ensemblesError || categoriesError || latestUsersError) {
      console.error("Erreur lors de la récupération des statistiques:", 
        usersError || vetementsError || ensemblesError || categoriesError || latestUsersError);
      throw new Error("Impossible de récupérer les statistiques");
    }

    // Compilation des statistiques
    const tableCounts: Record<string, number> = {
      profiles: usersCount || 0,
      vetements: vetementsCount || 0,
      tenues: ensemblesCount || 0,
      categories: categoriesCount || 0,
    };

    return {
      tableCounts,
      totalUsers: usersCount || 0,
      totalVetements: vetementsCount || 0,
      totalEnsembles: ensemblesCount || 0,
      totalCategories: categoriesCount || 0,
      latestRegistrations: latestUsers || [],
    };
  } catch (error) {
    console.error("Erreur dans getDatabaseStats:", error);
    throw error;
  }
};

/**
 * Récupère les informations détaillées sur une table
 */
export const getTableDetails = async (tableName: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(5);

    if (error) {
      console.error(`Erreur lors de la récupération des détails de la table ${tableName}:`, error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error(`Erreur dans getTableDetails pour ${tableName}:`, error);
    throw error;
  }
};
