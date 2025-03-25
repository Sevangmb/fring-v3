
import { supabase } from "@/lib/supabase";
import { UserOperationResponse } from "./types";
import { getUserById } from "./userProfile";

/**
 * Marque un utilisateur comme administrateur
 * @param userId ID de l'utilisateur à promouvoir
 * @returns Statut de succès et erreur éventuelle
 */
export const makeUserAdmin = async (
  userId: string
): Promise<UserOperationResponse> => {
  try {
    // Vérifier d'abord si l'utilisateur existe
    const userExists = await getUserById(userId);
    if (!userExists) {
      return {
        success: false,
        error: new Error("Utilisateur non trouvé")
      };
    }
    
    // Appeler la fonction RPC pour promouvoir l'utilisateur
    const { error } = await supabase.rpc('add_admin_user', {
      target_user_id: userId
    });
    
    if (error) {
      console.error("Erreur lors de la promotion de l'utilisateur:", error);
      return {
        success: false,
        error: new Error(error.message)
      };
    }
    
    console.log("Promotion d'utilisateur en admin:", userId);
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erreur lors de la promotion de l'utilisateur:", error);
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
): Promise<UserOperationResponse> => {
  try {
    // Vérifier d'abord si l'utilisateur existe
    const userExists = await getUserById(userId);
    if (!userExists) {
      return {
        success: false,
        error: new Error("Utilisateur non trouvé")
      };
    }
    
    // Appeler la fonction RPC pour rétrograder l'utilisateur
    const { error } = await supabase.rpc('remove_admin_user', {
      target_user_id: userId
    });
    
    if (error) {
      console.error("Erreur lors de la rétrogradation de l'utilisateur:", error);
      return {
        success: false,
        error: new Error(error.message)
      };
    }
    
    console.log("Révocation des droits d'admin:", userId);
    
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error("Erreur lors de la rétrogradation de l'utilisateur:", error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error("Unknown error"),
    };
  }
};
