
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/hooks/useVote";

/**
 * Récupérer les participations à un défi avec les informations de votes
 */
export const getDefiParticipationsWithVotes = async (defiId: number) => {
  try {
    // Récupérer les participations pour ce défi
    const { data: participationsData, error: participationsError } = await supabase
      .from('defi_participations')
      .select(`
        id, 
        defi_id, 
        user_id, 
        ensemble_id, 
        commentaire, 
        created_at
      `)
      .eq('defi_id', defiId);
    
    if (participationsError) throw participationsError;
    
    // Récupérer les détails pour chaque participation
    const participationsWithDetails = await Promise.all(participationsData.map(async (participation) => {
      // Récupérer les détails de l'ensemble
      const { data: ensemble } = await supabase
        .from('tenues')
        .select(`
          id, 
          nom, 
          description, 
          occasion, 
          saison, 
          created_at, 
          user_id,
          vetements:tenues_vetements(
            id,
            vetement:vetement_id(*),
            position_ordre
          )
        `)
        .eq('id', participation.ensemble_id)
        .single();
      
      // Récupérer les votes pour cet ensemble
      const { data: votesData } = await supabase
        .from('defi_votes')
        .select('vote')
        .eq('ensemble_id', participation.ensemble_id);
      
      // Compter les votes
      const votes = {
        up: votesData?.filter(v => v.vote === 'up').length || 0,
        down: votesData?.filter(v => v.vote === 'down').length || 0
      };
      
      // Calculer le score
      const score = votes.up - votes.down;
      
      return {
        ...participation,
        ensemble,
        votes,
        score
      };
    }));
    
    // Trier par score
    return participationsWithDetails.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error("Erreur lors du chargement des participations:", error);
    throw error;
  }
};

/**
 * Soumettre un vote pour une participation à un défi
 */
export const submitVote = async (defiId: number, ensembleId: number, vote: VoteType): Promise<boolean> => {
  try {
    // Vérifier la session utilisateur
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }
    
    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: fetchError } = await supabase
      .from('defi_votes')
      .select('id')
      .eq('ensemble_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (fetchError) throw fetchError;
    
    if (existingVote) {
      // Mettre à jour le vote existant
      const { error: updateError } = await supabase
        .from('defi_votes')
        .update({ vote })
        .eq('id', existingVote.id);
      
      if (updateError) throw updateError;
    } else {
      // Créer un nouveau vote
      const { error: insertError } = await supabase
        .from('defi_votes')
        .insert({
          defi_id: defiId,
          ensemble_id: ensembleId,
          user_id: userId,
          vote
        });
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return false;
  }
};

/**
 * Récupérer le vote d'un utilisateur pour un ensemble
 */
export const getUserVote = async (defiId: number, ensembleId: number): Promise<VoteType> => {
  try {
    // Vérifier la session utilisateur
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) return null;
    
    const { data } = await supabase
      .from('defi_votes')
      .select('vote')
      .eq('ensemble_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();
    
    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote:", error);
    return null;
  }
};

/**
 * Récupérer les détails d'un défi par son ID
 */
export const fetchDefiById = async (defiId: number) => {
  try {
    const { data, error } = await supabase
      .from('defis')
      .select('*')
      .eq('id', defiId)
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération du défi:", error);
    return null;
  }
};
