
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
      console.log('Récupération des vêtements pour l\'ami spécifique:', friendId);
      
      // Utiliser directement le RPC personnalisé pour récupérer les vêtements de l'ami spécifique
      const { data, error } = await supabase
        .rpc('get_friend_vetements', { friend_id_param: friendId });
      
      if (error) {
        console.error('Erreur lors de la récupération des vêtements de l\'ami:', error);
        throw error;
      }
      
      return data as Vetement[];
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
