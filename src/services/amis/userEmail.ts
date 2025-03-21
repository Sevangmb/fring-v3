
import { supabase } from '@/lib/supabase';

// Fonction pour obtenir l'email d'un utilisateur par son ID
export const getUserEmailById = async (userId: string): Promise<string | null> => {
  try {
    if (!userId) return null;
    
    // D'abord, essayer d'utiliser la RPC function
    try {
      const { data, error } = await supabase
        .rpc('get_user_id_by_email', { 
          email_param: userId
        });
      
      if (!error && data) {
        return data;
      }
    } catch (rpcError) {
      console.error('Erreur RPC, utilisation de la méthode directe:', rpcError);
    }
    
    // Méthode directe (fallback)
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération de l\'email:', error);
      return null;
    }
    
    return data?.email || null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'email:', error);
    return null;
  }
};
