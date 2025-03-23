
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { getCurrentUser } from "./utils";

/**
 * Récupérer le vote d'un utilisateur pour un ensemble ou un défi
 */
export const getUserVote = async (defiId: number, ensembleId?: number): Promise<VoteType> => {
  try {
    // Vérifier la session utilisateur
    const userId = await getCurrentUser();
    
    if (!userId) return null;
    
    const { data } = await fetchWithRetry(
      async () => {
        let query = supabase
          .from('defi_votes')
          .select('vote')
          .eq('defi_id', defiId)
          .eq('user_id', userId);

        // Filtrer par ensemble_id si fourni, sinon chercher les votes où ensemble_id est null
        if (ensembleId) {
          query = query.eq('ensemble_id', ensembleId);
        } else {
          query = query.is('ensemble_id', null);
        }

        return await query.maybeSingle();
      }
    );
    
    return data ? data.vote : null;
  } catch (error) {
    console.error("Erreur lors de la récupération du vote:", error);
    return null;
  }
};
