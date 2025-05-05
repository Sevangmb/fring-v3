
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
    console.log('fetchVetementsAmis appelé avec friendId:', friendId);
    
    // Vérifier l'état de la session utilisateur
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;
    
    console.log('Utilisateur courant:', currentUserId);
    
    if (!currentUserId) {
      console.error('Utilisateur non connecté, impossible de récupérer les vêtements des amis');
      return [];
    }
    
    // Si un ID d'ami spécifique est fourni et n'est pas 'all', utiliser get_specific_friend_clothes
    if (friendId && friendId !== 'all') {
      console.log('Récupération des vêtements pour l\'ami spécifique:', friendId);
      
      try {
        // Utiliser la fonction RPC en spécifiant clairement le nom de la fonction
        const { data, error } = await supabase
          .rpc('get_specific_friend_clothes', { friend_id_param: friendId });
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements de l\'ami:', error);
          if (error.message && error.message.includes('n\'est pas dans vos amis')) {
            console.warn(`L'utilisateur ${friendId} n'est pas dans vos amis ou la demande n'est pas acceptée`);
            return [];
          }
          throw error;
        }
        
        console.log('Vêtements de l\'ami récupérés:', data?.length || 0, 'vêtements');
        
        // Déboguer les données retournées
        if (data && data.length > 0) {
          console.log('Premier vêtement de l\'ami:', {
            id: data[0].id,
            nom: data[0].nom,
            user_id: data[0].user_id,
            owner_email: data[0].owner_email
          });
        }
        
        return data as Vetement[];
        
      } catch (innerError) {
        console.error('Erreur inattendue lors de la récupération des vêtements de l\'ami:', innerError);
        return [];
      }
    } else {
      // Pour 'all' ou undefined, utiliser la fonction get_friends_clothes
      console.log('Récupération des vêtements de tous les amis');
      try {
        // Utiliser la fonction RPC sans paramètres supplémentaires
        const { data, error } = await supabase
          .rpc('get_friends_clothes');
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements des amis:', error);
          throw error;
        }
        
        console.log('Vêtements des amis récupérés:', data?.length || 0, 'vêtements');
        
        // Déboguer les données retournées
        if (data && data.length > 0) {
          console.log('Échantillon des vêtements des amis:', data.slice(0, 3).map(v => ({
            id: v.id,
            nom: v.nom,
            user_id: v.user_id,
            owner_email: v.owner_email
          })));
        }
        
        return data as Vetement[];
      } catch (innerError) {
        console.error('Erreur inattendue lors de la récupération des vêtements des amis:', innerError);
        return [];
      }
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
