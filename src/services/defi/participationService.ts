
import { supabase } from '@/lib/supabase';

export interface DefiParticipation {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  note?: number;
  commentaire?: string;
  created_at: string;
}

/**
 * Participer à un défi en soumettant un ensemble
 */
export const participerDefi = async (defiId: number, ensembleId: number): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour participer à un défi');
    }

    // Vérifier si l'utilisateur a déjà participé à ce défi
    const { data: existingParticipation, error: checkError } = await supabase
      .from('defi_participations')
      .select('id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (checkError) {
      console.error('Erreur lors de la vérification de participation:', checkError);
      return false;
    }

    if (existingParticipation) {
      // Mettre à jour la participation existante
      const { error } = await supabase
        .from('defi_participations')
        .update({ ensemble_id: ensembleId })
        .eq('id', existingParticipation.id);

      if (error) {
        console.error('Erreur lors de la mise à jour de la participation:', error);
        return false;
      }
    } else {
      // Enregistrer la nouvelle participation
      const { error } = await supabase
        .from('defi_participations')
        .insert({
          defi_id: defiId,
          user_id: userId,
          ensemble_id: ensembleId
        });

      if (error) {
        console.error('Erreur lors de la participation au défi:', error);
        return false;
      }
      
      // Incrémenter directement le compteur de participants du défi
      const { error: updateError } = await supabase
        .from('defis')
        .update({ participants_count: supabase.rpc('increment', { 
          row_id: defiId, 
          table_name: 'defis' 
        })})
        .eq('id', defiId);
      
      if (updateError) {
        console.error('Erreur lors de l\'incrémentation du compteur:', updateError);
        // Ne pas bloquer le processus si cette étape échoue
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la participation au défi:', error);
    return false;
  }
};

/**
 * Vérifier si l'utilisateur participe déjà au défi
 */
export const checkUserParticipation = async (defiId: number): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      return false;
    }
    
    // Vérifier si l'utilisateur participe déjà
    const { data, error } = await supabase
      .from('defi_participations')
      .select('id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la vérification de participation:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Erreur lors de la vérification de participation:', error);
    return false;
  }
};

/**
 * Récupérer les participations d'un défi
 */
export const getDefiParticipations = async (defiId: number): Promise<DefiParticipation[]> => {
  try {
    const { data, error } = await supabase
      .from('defi_participations')
      .select('*')
      .eq('defi_id', defiId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des participations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des participations:', error);
    return [];
  }
};

/**
 * Compter le nombre de participants pour un défi et mettre à jour la base de données
 */
export const updateDefiParticipantsCount = async (defiId: number): Promise<boolean> => {
  try {
    // Compter le nombre de participants uniques
    const { count, error: countError } = await supabase
      .from('defi_participations')
      .select('user_id', { count: 'exact', head: true })
      .eq('defi_id', defiId);
    
    if (countError) {
      console.error('Erreur lors du comptage des participants:', countError);
      return false;
    }
    
    // Mettre à jour le compteur dans la table defis
    const { error: updateError } = await supabase
      .from('defis')
      .update({ participants_count: count || 0 })
      .eq('id', defiId);
    
    if (updateError) {
      console.error('Erreur lors de la mise à jour du compteur:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du compteur:', error);
    return false;
  }
};
