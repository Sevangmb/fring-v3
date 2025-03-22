
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
    
    // Vérifier si l'amitié existe pour déboguer
    if (friendId && friendId !== 'all') {
      console.log('Vérification de l\'amitié entre', currentUserId, 'et', friendId);
      
      const { data: amitieData, error: amitieError } = await supabase
        .from('amis')
        .select('*')
        .or(`and(user_id.eq.${currentUserId},ami_id.eq.${friendId}),and(user_id.eq.${friendId},ami_id.eq.${currentUserId})`)
        .eq('status', 'accepted');
      
      console.log('Résultat de la vérification d\'amitié:', amitieData, amitieError);
      
      if (amitieError) {
        console.error('Erreur lors de la vérification de l\'amitié:', amitieError);
      } else if (!amitieData || amitieData.length === 0) {
        console.warn(`Aucune relation d'amitié acceptée trouvée entre ${currentUserId} et ${friendId}`);
      } else {
        console.log('Relation d\'amitié confirmée:', amitieData);
      }
    }
    
    // Si un ID d'ami spécifique est fourni et n'est pas 'all', utiliser la fonction get_specific_friend_clothes
    if (friendId && friendId !== 'all') {
      console.log('Récupération des vêtements pour l\'ami spécifique:', friendId);
      
      try {
        // Utiliser la fonction RPC en spécifiant clairement le nom de la fonction
        const { data, error } = await supabase
          .rpc('get_specific_friend_clothes', { friend_id_param: friendId });
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements de l\'ami:', error);
          if (error.message.includes('n\'est pas dans vos amis')) {
            console.warn(`L'utilisateur ${friendId} n'est pas dans vos amis ou la demande n'est pas acceptée`);
            return [];
          }
          throw error;
        }
        
        console.log('Vêtements de l\'ami récupérés:', data?.length || 0, 'vêtements');
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
