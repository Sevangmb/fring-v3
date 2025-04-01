
import { supabase } from "@/lib/supabase";

/**
 * Interface pour les données d'utilisateur
 */
export interface AdminUserData {
  id: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  last_sign_in_at?: string;
  app_metadata?: {
    provider?: string;
    roles?: string[];
  };
}

/**
 * Récupère tous les utilisateurs (limité aux administrateurs)
 * @returns Liste des utilisateurs
 */
export const getAllUsers = async (): Promise<AdminUserData[]> => {
  try {
    // Utiliser une requête directe pour récupérer tous les utilisateurs
    // Sans utiliser RPC qui semble ne pas fonctionner correctement
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }

    // Pour chaque profil, nous récupérons les informations supplémentaires si nécessaire
    // Par défaut, nous utilisons les données du profil
    return data?.map(profile => ({
      id: profile.id,
      email: profile.email,
      created_at: profile.updated_at, // Utiliser updated_at comme proxy pour created_at
      user_metadata: {
        full_name: 'Utilisateur ' + profile.email?.substring(0, 5),
      },
      app_metadata: {}
    })) || [];
  } catch (error) {
    console.error("Erreur dans getAllUsers:", error);
    throw error;
  }
};

/**
 * Recherche des utilisateurs par email (limité aux administrateurs)
 * @param searchTerm Terme de recherche (email)
 * @returns Liste des utilisateurs correspondant à la recherche
 */
export const searchUsersByEmail = async (searchTerm: string): Promise<AdminUserData[]> => {
  try {
    // Utiliser une requête directe pour chercher les utilisateurs par email
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('email', `%${searchTerm}%`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      throw error;
    }

    // Transformer les données du profil en AdminUserData
    return data?.map(profile => ({
      id: profile.id,
      email: profile.email,
      created_at: profile.updated_at, // Utiliser updated_at comme proxy pour created_at
      user_metadata: {
        full_name: 'Utilisateur ' + profile.email?.substring(0, 5),
      },
      app_metadata: {}
    })) || [];
  } catch (error) {
    console.error("Erreur dans searchUsersByEmail:", error);
    throw error;
  }
};

/**
 * Récupère les statistiques d'un utilisateur (vêtements, ensembles)
 * @param userId ID de l'utilisateur
 * @returns Statistiques de l'utilisateur
 */
export const getUserStats = async (userId: string): Promise<{ vetements: number; ensembles: number }> => {
  try {
    // Récupérer le nombre de vêtements
    const { count: vetementsCount, error: vetementsError } = await supabase
      .from('vetements')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (vetementsError) throw vetementsError;

    // Récupérer le nombre d'ensembles
    const { count: ensemblesCount, error: ensemblesError } = await supabase
      .from('tenues')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (ensemblesError) throw ensemblesError;

    return {
      vetements: vetementsCount || 0,
      ensembles: ensemblesCount || 0
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques utilisateur:", error);
    return { vetements: 0, ensembles: 0 };
  }
};

/**
 * Supprime un utilisateur (admin uniquement)
 * @param userId ID de l'utilisateur à supprimer
 * @returns Succès de l'opération
 */
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    // Note: La suppression d'un utilisateur nécessite le rôle service_role
    // Cette fonction devrait être exécutée via une fonction Edge/RPC pour sécurité
    const { error } = await supabase.rpc('admin_delete_user', {
      user_id_param: userId
    });

    if (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error("Erreur dans deleteUser:", error);
    return false;
  }
};
