
import { supabase } from '@/lib/supabase';

/**
 * Gets a user ID by email
 */
export const getUserIdByEmail = async (email: string): Promise<string | null> => {
  try {
    // Utiliser la fonction RPC pour exécuter une requête SQL custom
    const { data, error } = await supabase.rpc('get_user_id_by_email', {
      email_param: email
    });
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ID utilisateur:', error);
    return null;
  }
};

/**
 * Assigns all clothes to a specific user
 */
export const assignAllClothesToUser = async (userId: string): Promise<boolean> => {
  try {
    // Utiliser la fonction RPC pour exécuter une mise à jour
    const { error } = await supabase.rpc('assign_all_clothes_to_user', {
      target_user_id: userId
    });
    
    if (error) {
      console.error('Erreur lors de l\'attribution des vêtements:', error);
      return false;
    }
    
    console.log('Vêtements attribués avec succès à l\'utilisateur ID:', userId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'attribution des vêtements:', error);
    return false;
  }
};

/**
 * Assigns all clothes to a user specified by email
 */
export const assignVetementsToUser = async (userEmail: string): Promise<boolean> => {
  try {
    // Récupérer l'ID de l'utilisateur à partir de son email en utilisant la fonction SQL
    const { data: userId, error: userError } = await supabase.rpc('get_user_id_by_email', {
      email_param: userEmail
    });
    
    if (userError) {
      console.error('Erreur lors de la récupération de l\'ID utilisateur:', userError);
      return false;
    }
    
    if (!userId) {
      console.error('Utilisateur non trouvé:', userEmail);
      return false;
    }
    
    console.log('ID de l\'utilisateur récupéré:', userId);
    
    // Utiliser la fonction RPC pour attribuer tous les vêtements sans propriétaire à cet utilisateur
    const { data: affectedRows, error: updateError } = await supabase.rpc('assign_all_clothes_to_user', {
      target_user_id: userId
    });
    
    if (updateError) {
      console.error('Erreur lors de l\'attribution des vêtements:', updateError);
      return false;
    }
    
    console.log(`Vêtements ont été attribués à l'utilisateur ${userEmail}`);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'attribution des vêtements:', error);
    return false;
  }
};
