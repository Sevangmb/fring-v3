
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { getCurrentUser } from "./utils";

/**
 * Soumettre un vote pour une participation à un défi
 */
export const submitVote = async (defiId: number, ensembleId: number, vote: VoteType): Promise<boolean> => {
  try {
    // Vérifier la session utilisateur
    const userId = await getCurrentUser();
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }
    
    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: fetchError } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('defi_votes')
          .select('id')
          .eq('ensemble_id', ensembleId)
          .eq('user_id', userId)
          .maybeSingle();
      }
    );
    
    if (fetchError) throw fetchError;
    
    if (existingVote) {
      // Mettre à jour le vote existant
      const { error: updateError } = await fetchWithRetry(
        async () => {
          return await supabase
            .from('defi_votes')
            .update({ vote })
            .eq('id', existingVote.id);
        }
      );
      
      if (updateError) throw updateError;
    } else {
      // Créer un nouveau vote
      const { error: insertError } = await fetchWithRetry(
        async () => {
          return await supabase
            .from('defi_votes')
            .insert({
              defi_id: defiId,
              ensemble_id: ensembleId,
              user_id: userId,
              vote
            });
        }
      );
      
      if (insertError) throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return false;
  }
};
