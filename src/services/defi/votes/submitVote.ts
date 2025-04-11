
import { supabase } from '@/lib/supabase';
import { VoteType } from '@/services/votes/types';

/**
 * Soumet un vote pour un ensemble dans un défi
 * @param defiId ID du défi
 * @param ensembleId ID de l'ensemble
 * @param vote Type de vote (up/down)
 * @returns Succès ou échec
 */
export const submitVote = async (
  defiId: number,
  ensembleId: number,
  vote: VoteType
): Promise<boolean> => {
  try {
    if (!vote) return false;

    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      throw new Error("Utilisateur non connecté");
    }

    console.log(`Soumission du vote pour défi ${defiId}, ensemble ${ensembleId}, vote=${vote}, utilisateur=${userId}`);

    // Vérifier si l'utilisateur a déjà voté pour cet ensemble dans ce défi
    const { data: existingVote, error: checkError } = await supabase
      .from('defi_votes')
      .select('id, vote_type')
      .eq('defi_id', defiId)
      .eq('tenue_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Erreur lors de la vérification du vote:', checkError);
      return false;
    }

    // Si l'utilisateur a déjà voté, mettre à jour son vote
    if (existingVote) {
      // Si le vote est identique, ne rien faire
      if (existingVote.vote_type === vote) {
        return true;
      }

      // Mettre à jour le vote
      const { error: updateError } = await supabase
        .from('defi_votes')
        .update({ 
          vote_type: vote,
          vote: vote // Pour la rétrocompatibilité
        })
        .eq('id', existingVote.id);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du vote:', updateError);
        return false;
      }
    } else {
      // Sinon, insérer un nouveau vote
      const { error: insertError } = await supabase
        .from('defi_votes')
        .insert({
          defi_id: defiId,
          tenue_id: ensembleId,
          user_id: userId,
          vote_type: vote,
          vote: vote // Pour la rétrocompatibilité
        });

      if (insertError) {
        console.error('Erreur lors de l\'ajout du vote:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    return false;
  }
};
