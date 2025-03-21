
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
    // Au lieu d'utiliser la fonction RPC, faisons une requête directe via la table auth.users
    const { data, error } = await supabase
      .from('auth_users_view')
      .select('id, email, created_at')
      .ilike('email', `%${searchTerm}%`)
      .neq('id', await getCurrentUserId())
      .limit(10);
    
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

// Fonction utilitaire pour obtenir l'ID de l'utilisateur actuel
const getCurrentUserId = async (): Promise<string> => {
  const { data } = await supabase.auth.getSession();
  return data.session?.user?.id || '';
};
