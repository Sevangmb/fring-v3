
import { supabase } from '@/lib/supabase';

// Type pour un utilisateur
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Fonction pour rechercher des utilisateurs par email
export const searchUsersByEmail = async (searchTerm: string): Promise<User[]> => {
  try {
    console.log('Recherche d\'utilisateurs avec le terme:', searchTerm);

    // Rechercher les utilisateurs dont l'email contient le terme de recherche
    const { data, error } = await supabase.rpc('search_users_by_email', {
      search_term: searchTerm
    });
    
    if (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }
    
    console.log('Utilisateurs trouvés:', data);
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    return [];
  }
};
