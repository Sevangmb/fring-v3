
import { supabase } from './client'

// Fonction pour récupérer l'identifiant d'un utilisateur par son email
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

// Fonction pour attribuer tous les vêtements à un utilisateur spécifique
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
