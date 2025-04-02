import { supabase } from '@/lib/supabase';

/**
 * Interface for defi participation
 */
export interface DefiParticipation {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
  // Optional joined fields
  user_email?: string;
  ensemble_nom?: string;
}

/**
 * Get participations for a specific defi
 */
export const getDefiParticipations = async (defiId: number): Promise<DefiParticipation[]> => {
  try {
    const { data, error } = await supabase
      .from('defi_participations')
      .select(`
        id,
        defi_id,
        user_id,
        ensemble_id,
        commentaire,
        created_at,
        profiles:user_id(email),
        tenues:ensemble_id(nom)
      `)
      .eq('defi_id', defiId);

    if (error) throw error;

    return (data || []).map(item => ({
      id: item.id,
      defi_id: item.defi_id,
      user_id: item.user_id,
      ensemble_id: item.ensemble_id,
      commentaire: item.commentaire,
      created_at: item.created_at,
      user_email: item.profiles && item.profiles.email ? item.profiles.email : undefined,
      ensemble_nom: item.tenues && item.tenues.nom ? item.tenues.nom : undefined
    }));
  } catch (error) {
    console.error('Error fetching defi participations:', error);
    return [];
  }
};

/**
 * Vérifie si un utilisateur a participé à un défi
 * @param defiId ID du défi
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non fourni)
 * @returns Un objet avec le statut de participation et l'ID de l'ensemble si participé
 */
export const checkUserParticipation = async (
  defiId: number,
  userId?: string
): Promise<{ participe: boolean; ensembleId?: number }> => {
  try {
    // If userId is not provided, get the current user's ID
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        return { participe: false };
      }
    }

    const { data, error } = await supabase
      .from('defi_participations')
      .select('ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return { participe: false };
    }

    return { 
      participe: true,
      ensembleId: data.ensemble_id
    };
  } catch (error) {
    console.error('Error checking user participation:', error);
    return { participe: false };
  }
};

/**
 * Participer à un défi avec un ensemble
 * @param defiId ID du défi
 * @param ensembleId ID de l'ensemble
 * @returns true si la participation a réussi, false sinon
 */
export const participerDefi = async (defiId: number, ensembleId: number): Promise<boolean> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }
    
    // Vérifier si l'utilisateur a déjà participé
    const { data: existingParticipation } = await supabase
      .from('defi_participations')
      .select('id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .single();
    
    // Get user email for events tracking
    const { data: userData } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
    
    let userEmail = userData?.email || '';
    
    if (existingParticipation) {
      // Mettre à jour la participation existante
      const { error } = await supabase
        .from('defi_participations')
        .update({ ensemble_id: ensembleId })
        .eq('id', existingParticipation.id);
        
      if (error) throw error;
      
      // Log the update
      console.log(`User ${userEmail} updated their participation to defi ${defiId} with ensemble ${ensembleId}`);
    } else {
      // Créer une nouvelle participation
      const { error } = await supabase
        .from('defi_participations')
        .insert({
          defi_id: defiId,
          user_id: userId,
          ensemble_id: ensembleId
        });
        
      if (error) throw error;
      
      // Mettre à jour le compteur de participations dans la table défi
      await supabase
        .from('defis')
        .update({ 
          participants_count: supabase.rpc('increment', { row_id: defiId, table_name: 'defis' }) 
        })
        .eq('id', defiId);
        
      // Log the new participation
      console.log(`User ${userEmail} participated in defi ${defiId} with ensemble ${ensembleId}`);
    }

    return true;
  } catch (error) {
    console.error('Error submitting participation:', error);
    return false;
  }
};
