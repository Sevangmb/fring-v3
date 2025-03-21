
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

    // Essayer d'abord avec la fonction RPC
    try {
      const { data, error } = await supabase.rpc('search_users_by_email', {
        search_term: searchTerm
      });
      
      if (!error && data) {
        console.log('Utilisateurs trouvés via RPC:', data);
        return data || [];
      }
    } catch (rpcError) {
      console.log('Erreur RPC, essai avec requête directe:', rpcError);
    }

    // Si la fonction RPC échoue, essayer avec une requête directe
    const { data: currentUser } = await supabase.auth.getSession();
    const currentUserId = currentUser.session?.user?.id || '';
    
    // Requête directe sur la table auth.users (nécessite des droits appropriés)
    const { data, error } = await supabase
      .from('auth_users_view')
      .select('id, email, created_at')
      .ilike('email', `%${searchTerm}%`)
      .neq('id', currentUserId)
      .limit(10);
    
    if (error) {
      console.error('Erreur lors de la recherche d\'utilisateurs:', error);
      return [];
    }
    
    console.log('Utilisateurs trouvés via requête directe:', data);
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    return [];
  }
};
