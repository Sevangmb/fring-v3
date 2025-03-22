
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
    // Ajouter plus de logs pour le débogage
    console.log('fetchVetementsAmis appelé avec friendId:', friendId);
    
    // Si un ID d'ami spécifique est fourni et n'est pas 'all', filtrer uniquement ses vêtements
    if (friendId && friendId !== 'all') {
      console.log('Récupération des vêtements pour l\'ami spécifique:', friendId);
      
      try {
        // Vérifier d'abord si c'est un ami avec status 'accepted'
        const { data: amisData, error: amisError } = await supabase
          .from('amis')
          .select('*')
          .or(`(user_id.eq.${friendId}.and.ami_id.eq.${auth.uid()}),(user_id.eq.${auth.uid()}.and.ami_id.eq.${friendId})`)
          .eq('status', 'accepted')
          .maybeSingle();
          
        if (amisError) {
          console.error('Erreur lors de la vérification de l\'amitié:', amisError);
        }
        
        console.log('Statut de l\'amitié avec', friendId, ':', amisData ? 'Accepté' : 'Non accepté ou inexistant');
        
        // Utiliser la fonction RPC personnalisée pour récupérer les vêtements de l'ami spécifique
        const { data, error } = await supabase
          .rpc('get_friend_vetements', { friend_id_param: friendId });
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements de l\'ami:', error);
          // Ne pas relancer l'erreur, retourner un tableau vide à la place
          return [];
        }
        
        console.log('Vêtements de l\'ami récupérés:', data?.length || 0, 'vêtements');
        return data as Vetement[];
        
      } catch (innerError) {
        console.error('Erreur inattendue lors de la récupération des vêtements de l\'ami:', innerError);
        return [];
      }
    } else {
      console.log('Récupération des vêtements de tous les amis');
      try {
        // Sinon, utiliser la fonction RPC pour récupérer tous les vêtements des amis
        const { data, error } = await supabase
          .rpc('get_friends_vetements');
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements des amis:', error);
          return [];
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
