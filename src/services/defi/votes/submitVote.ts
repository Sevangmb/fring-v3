
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { getCurrentUser } from "./utils";

/**
 * Soumettre un vote pour une participation à un défi ou pour un défi lui-même
 */
export const submitVote = async (defiId: number, ensembleId: number | null, vote: VoteType): Promise<boolean> => {
  try {
    // Vérifier la session utilisateur
    const userId = await getCurrentUser();
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }

    // Structure de base des données à insérer/mettre à jour
    const voteData: any = {
      defi_id: defiId,
      user_id: userId,
      vote
    };

    // Ajouter ensemble_id seulement si fourni (vote sur un ensemble spécifique)
    if (ensembleId) {
      voteData.ensemble_id = ensembleId;
    }
    
    // Vérifier si l'utilisateur a déjà voté
    const { data: existingVote, error: fetchError } = await fetchWithRetry(
      async () => {
        let query = supabase
          .from('defi_votes')
          .select('id')
          .eq('defi_id', defiId)
          .eq('user_id', userId);

        // Filtrer par ensemble_id seulement si fourni
        if (ensembleId) {
          query = query.eq('ensemble_id', ensembleId);
        } else {
          query = query.is('ensemble_id', null);
        }

        return await query.maybeSingle();
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
      console.log(`Vote mis à jour: ${vote} pour défi ${defiId}${ensembleId ? `, ensemble ${ensembleId}` : ''}`);
    } else {
      // Créer un nouveau vote
      const { error: insertError } = await fetchWithRetry(
        async () => {
          return await supabase
            .from('defi_votes')
            .insert(voteData);
        }
      );
      
      if (insertError) throw insertError;
      console.log(`Nouveau vote: ${vote} pour défi ${defiId}${ensembleId ? `, ensemble ${ensembleId}` : ''}`);
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors du vote:", error);
    return false;
  }
};
