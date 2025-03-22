
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

    // Enregistrer la participation
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
    
    // Incrémenter le compteur de participants du défi
    await supabase.rpc('increment', { 
      row_id: defiId, 
      table_name: 'defis' 
    });
    
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
