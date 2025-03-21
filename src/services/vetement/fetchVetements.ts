
import { supabase } from '@/lib/supabase';
import { Vetement } from './types';

/**
 * Fetches all vetements for the currently authenticated user
 */
export const fetchVetements = async (): Promise<Vetement[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      console.error('Utilisateur non connecté');
      return [];
    }

    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des vêtements:', error);
      throw error;
    }

    return data as Vetement[];
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements:', error);
    throw error;
  }
};

/**
 * Fetches vetements shared by friends of the current user
 * @param friendId Optional ID of a specific friend to filter by
 */
export const fetchVetementsAmis = async (friendId?: string): Promise<Vetement[]> => {
  try {
    // Si un ID d'ami spécifique est fourni, filtrer uniquement ses vêtements
    if (friendId) {
      // Utiliser une jointure avec la table auth.users pour obtenir l'email
      const { data: userData, error: userError } = await supabase
        .from('vetements')
        .select('*, profiles:user_id(email)')
        .eq('user_id', friendId)
        .order('created_at', { ascending: false });
      
      if (userError) {
        console.error('Erreur lors de la récupération des vêtements de l\'ami:', userError);
        throw userError;
      }
      
      // Transformer les données pour inclure l'email du propriétaire
      return userData.map(item => {
        const vetement: Vetement = {
          ...item,
          // Extraire l'email de la relation profiles si disponible
          owner_email: item.profiles?.email || 'Email inconnu'
        };
        // Supprimer la propriété profiles qui n'est pas dans le type Vetement
        delete (vetement as any).profiles;
        return vetement;
      });
    } else {
      // Sinon, utiliser la fonction RPC pour récupérer tous les vêtements des amis
      const { data, error } = await supabase
        .rpc('get_friends_vetements');
      
      if (error) {
        console.error('Erreur lors de la récupération des vêtements des amis:', error);
        throw error;
      }
      
      return data as Vetement[];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des vêtements des amis:', error);
    return [];
  }
};

/**
 * Fetches a specific vetement by its ID
 */
export const getVetementById = async (id: number): Promise<Vetement> => {
  try {
    const { data, error } = await supabase
      .from('vetements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du vêtement:', error);
      throw error;
    }
    
    return data as Vetement;
  } catch (error) {
    console.error('Erreur lors de la récupération du vêtement:', error);
    throw error;
  }
};
