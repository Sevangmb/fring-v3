
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
}

/**
 * Récupère tous les utilisateurs (limité aux administrateurs)
 * @returns Liste des utilisateurs
 */
export const getAllUsers = async (): Promise<AdminUserData[]> => {
  try {
    const { data, error } = await supabase.rpc('search_admin_users', {
      search_term: ''
    });

    if (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      throw error;
    }

    return data || [];
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
    const { data, error } = await supabase.rpc('search_admin_users', {
      search_term: searchTerm
    });

    if (error) {
      console.error("Erreur lors de la recherche d'utilisateurs:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Erreur dans searchUsersByEmail:", error);
    throw error;
  }
};
