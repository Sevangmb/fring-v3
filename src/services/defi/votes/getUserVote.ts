
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { getCurrentUser } from "./utils";

/**
 * Récupérer le vote d'un utilisateur pour un ensemble
 */
export const getUserVote = async (defiId: number, ensembleId: number): Promise<VoteType> => {
  try {
    // Vérifier la session utilisateur
    const userId = await getCurrentUser();
    
    if (!userId) return null;
    
    const { data } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('defi_votes')
          .select('vote')
          .eq('ensemble_id', ensembleId)
          .eq('user_id', userId)
          .maybeSingle();
      }
    );
    
    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote:", error);
    return null;
  }
};
