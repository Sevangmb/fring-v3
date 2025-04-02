
import { supabase } from '@/lib/supabase';

/**
 * Vérifier si l'utilisateur a déjà participé à un défi
 */
export const checkUserParticipation = async (defiId: number): Promise<{
  participe: boolean;
  ensembleId?: number;
}> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { participe: false };
    
    // Vérifier s'il existe une participation pour cet utilisateur sur ce défi
    const { data, error } = await supabase
      .from('defi_participations')
      .select('id, ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', session.user.id)
      .maybeSingle();
    
    if (error) throw error;
    
    return {
      participe: !!data,
      ensembleId: data?.ensemble_id
    };
  } catch (error) {
    console.error("Erreur lors de la vérification de la participation:", error);
    return { participe: false };
  }
};

/**
 * Participer à un défi avec un ensemble existant
 */
export const participerDefi = async (defiId: number, ensembleId: number): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.error("Impossible de participer: utilisateur non connecté");
      return false;
    }
    
    // Vérifier si l'utilisateur a déjà participé à ce défi
    const { participe } = await checkUserParticipation(defiId);
    
    if (participe) {
      throw new Error("Vous avez déjà participé à ce défi");
    }
    
    // Vérifier si l'ensemble existe et appartient à l'utilisateur
    const { data: ensemble, error: ensembleError } = await supabase
      .from('tenues')
      .select('id')
      .eq('id', ensembleId)
      .eq('user_id', session.user.id)
      .single();
    
    if (ensembleError || !ensemble) {
      throw new Error("Cet ensemble n'existe pas ou ne vous appartient pas");
    }
    
    // Créer la participation
    const { error } = await supabase
      .from('defi_participations')
      .insert({
        defi_id: defiId,
        user_id: session.user.id,
        ensemble_id: ensembleId
      });
    
    if (error) throw error;
    
    // Incrémenter le compteur de participants
    await supabase.rpc('increment_defi_participants', { defi_id: defiId });
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la participation au défi:", error);
    throw error;
  }
};
