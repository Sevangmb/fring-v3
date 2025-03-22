
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
        // Obtenir la session courante pour récupérer l'ID utilisateur
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user?.id;
        
        if (!currentUserId) {
          console.error('Utilisateur non connecté');
          return [];
        }
        
        // Vérifier d'abord si c'est un ami avec status 'accepted'
        console.log(`Vérification de l'amitié entre ${currentUserId} et ${friendId}`);
        const { data: amisData, error: amisError } = await supabase
          .from('amis')
          .select('*')
          .or(`(user_id.eq.${friendId}.and.ami_id.eq.${currentUserId}),(user_id.eq.${currentUserId}.and.ami_id.eq.${friendId})`)
          .eq('status', 'accepted')
          .maybeSingle();
          
        if (amisError) {
          console.error('Erreur lors de la vérification de l\'amitié:', amisError);
        }
        
        console.log('Statut de l\'amitié avec', friendId, ':', amisData ? 'Accepté' : 'Non accepté ou inexistant');
        console.log('Données de l\'amitié:', amisData);
        
        // Si l'amitié n'est pas acceptée, retourner un tableau vide au lieu de lancer une exception
        if (!amisData) {
          console.warn(`L'utilisateur ${friendId} n'est pas dans vos amis ou la demande n'est pas acceptée`);
          return [];
        }
        
        // Utiliser directement une requête SQL au lieu de la fonction RPC pour contourner les problèmes RLS
        console.log('Récupération directe des vêtements de l\'ami:', friendId);
        const { data, error } = await supabase
          .from('vetements')
          .select('*, profiles!inner(email)')
          .eq('user_id', friendId)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements de l\'ami:', error);
          return [];
        }
        
        // Transformer les données pour inclure l'email
        const vetementsWithEmail = data.map(vetement => ({
          ...vetement,
          owner_email: vetement.profiles.email
        }));
        
        console.log('Vêtements de l\'ami récupérés:', vetementsWithEmail.length || 0, 'vêtements');
        return vetementsWithEmail as Vetement[];
        
      } catch (innerError) {
        console.error('Erreur inattendue lors de la récupération des vêtements de l\'ami:', innerError);
        return [];
      }
    } else {
      console.log('Récupération des vêtements de tous les amis');
      try {
        // Obtenir la session courante pour récupérer l'ID utilisateur
        const { data: sessionData } = await supabase.auth.getSession();
        const currentUserId = sessionData.session?.user?.id;
        
        if (!currentUserId) {
          console.error('Utilisateur non connecté');
          return [];
        }
        
        // Récupérer d'abord la liste des amis avec status 'accepted'
        const { data: amisList, error: amisError } = await supabase
          .from('amis')
          .select('*')
          .or(`user_id.eq.${currentUserId},ami_id.eq.${currentUserId}`)
          .eq('status', 'accepted');
        
        if (amisError) {
          console.error('Erreur lors de la récupération des amis:', amisError);
          return [];
        }
        
        // Extraire les IDs des amis
        const friendIds = amisList.map(ami => 
          ami.user_id === currentUserId ? ami.ami_id : ami.user_id
        );
        
        console.log('IDs des amis récupérés:', friendIds);
        
        if (friendIds.length === 0) {
          console.log('Aucun ami trouvé, retourne un tableau vide');
          return [];
        }
        
        // Récupérer les vêtements de tous les amis
        const { data, error } = await supabase
          .from('vetements')
          .select('*, profiles!inner(email)')
          .in('user_id', friendIds)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Erreur lors de la récupération des vêtements des amis:', error);
          return [];
        }
        
        // Transformer les données pour inclure l'email
        const vetementsWithEmail = data.map(vetement => ({
          ...vetement,
          owner_email: vetement.profiles.email
        }));
        
        console.log('Vêtements des amis récupérés:', vetementsWithEmail.length || 0, 'vêtements');
        return vetementsWithEmail as Vetement[];
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
