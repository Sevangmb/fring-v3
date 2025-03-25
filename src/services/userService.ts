
import { supabase } from "@/lib/supabase";

/**
 * User type definition
 */
export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

/**
 * Search users by email
 * @param email Email to search for
 * @returns Array of users matching the search criteria
 */
export const searchUsersByEmail = async (email: string): Promise<User[]> => {
  try {
    // Use a secure RPC function to search for users
    const { data, error } = await supabase.rpc('search_admin_users', {
      search_term: email
    });

    if (error) {
      console.error("Error searching users:", error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error("Error in searchUsersByEmail:", error);
    throw error;
  }
};

/**
 * Uploads an avatar image to Supabase storage
 * @param userId User ID for file naming
 * @param base64Image Base64 encoded image string
 * @returns URL of the uploaded avatar or null if failed
 */
export const uploadAvatar = async (
  userId: string, 
  base64Image: string
): Promise<string | null> => {
  try {
    const base64Data = base64Image.split(',')[1];
    const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(res => res.blob());
    
    const fileExt = "jpg";
    const fileName = `${userId}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error, data } = await supabase.storage
      .from('avatars')
      .upload(fileName, blob);
      
    if (error) {
      throw error;
    }
    
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
    
    return urlData?.publicUrl || null;
  } catch (error) {
    console.error("Avatar upload error:", error);
    return null;
  }
};

/**
 * Updates user metadata in Supabase
 * @param userData Object containing user data fields to update
 * @returns Success status and any error
 */
export const updateUserMetadata = async (
  userData: { [key: string]: any }
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    const { error } = await supabase.auth.updateUser({
      data: userData,
    });

    return {
      success: !error,
      error: error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

/**
 * Récupère un utilisateur par son ID
 */
export const getUserById = async (userId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Erreur lors de la récupération de l'utilisateur:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

/**
 * Marque un utilisateur comme administrateur
 * @param userId ID de l'utilisateur à promouvoir
 * @returns Statut de succès et erreur éventuelle
 */
export const makeUserAdmin = async (
  userId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Implementation pour ajouter un utilisateur à la liste des administrateurs
    // Cela pourrait être implémenté en ajoutant l'email de l'utilisateur à une table d'administrateurs
    // ou en définissant un champ is_admin dans la table profiles
    
    // Pour l'instant, c'est juste un placeholder
    console.log("Promotion d'utilisateur en admin:", userId);
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};

/**
 * Retire les droits d'administrateur d'un utilisateur
 * @param userId ID de l'utilisateur
 * @returns Statut de succès et erreur éventuelle
 */
export const removeUserAdmin = async (
  userId: string
): Promise<{ success: boolean; error: Error | null }> => {
  try {
    // Implementation pour retirer un utilisateur de la liste des administrateurs
    // Similaire à makeUserAdmin, mais avec l'opération inverse
    
    // Pour l'instant, c'est juste un placeholder
    console.log("Révocation des droits d'admin:", userId);
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};
