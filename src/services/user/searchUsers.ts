
import { supabase } from "@/lib/supabase";
import { User } from "./types";

/**
 * Search users by email
 * @param email Email to search for
 * @returns Array of users matching the search criteria
 */
export const searchUsersByEmail = async (email: string): Promise<User[]> => {
  try {
    // Utiliser la fonction RPC search_admin_users qui a été corrigée pour éviter l'ambiguïté de colonne
    const { data, error } = await supabase.rpc('search_admin_users', {
      search_term: email
    });

    if (error) {
      console.error("Error searching users:", error);
      throw new Error(error.message);
    }

    // Transformer les données pour correspondre au type User
    const users = data || [];
    return users.map(user => ({
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      user_metadata: user.user_metadata
    }));
  } catch (error) {
    console.error("Error in searchUsersByEmail:", error);
    throw error;
  }
};
