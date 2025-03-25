
import { supabase } from "@/lib/supabase";
import { UserOperationResponse } from "./types";

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
): Promise<UserOperationResponse> => {
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
    // D'abord essayer de récupérer l'utilisateur depuis la table auth.users via une fonction RPC
    const { data: userData, error: userError } = await supabase.rpc('get_user_by_id', {
      user_id: userId
    });
    
    if (userError) {
      // Si la fonction RPC n'existe pas, essayer de récupérer depuis les profils
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Erreur lors de la récupération de l'utilisateur:", profileError);
        throw profileError;
      }

      return profileData;
    }

    return userData;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};
