
import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { isValidEntityId } from "./utils/voteUtils";

export interface EnsembleVoteResults {
  ensembleId: number;
  upVotes: number;
  downVotes: number;
  score: number;
  ensembleName?: string;
  userName?: string;
}

/**
 * Récupérer l'ensemble gagnant pour un défi donné
 */
export const getWinningEnsemble = async (defiId: number): Promise<EnsembleVoteResults | null> => {
  if (!isValidEntityId(defiId)) {
    console.error("ID du défi invalide");
    return null;
  }

  try {
    // Récupérer tous les votes des ensembles pour ce défi
    const { data: votesData, error: votesError } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('defi_votes')
          .select('ensemble_id, vote')
          .eq('defi_id', defiId)
          .not('ensemble_id', 'is', null);
      },
      3
    );

    if (votesError) throw votesError;

    // Agréger les votes par ensemble
    const voteCounts: Record<number, { up: number; down: number }> = {};
    
    votesData.forEach(vote => {
      const ensembleId = vote.ensemble_id;
      
      if (!voteCounts[ensembleId]) {
        voteCounts[ensembleId] = { up: 0, down: 0 };
      }
      
      if (vote.vote === 'up') voteCounts[ensembleId].up += 1;
      if (vote.vote === 'down') voteCounts[ensembleId].down += 1;
    });
    
    // Calculer le score pour chaque ensemble et trouver le gagnant
    const results: EnsembleVoteResults[] = Object.entries(voteCounts).map(([ensembleId, votes]) => {
      const score = votes.up - votes.down;
      return {
        ensembleId: parseInt(ensembleId),
        upVotes: votes.up,
        downVotes: votes.down,
        score
      };
    });
    
    // Trier par score et prendre le meilleur
    results.sort((a, b) => b.score - a.score);
    
    if (results.length === 0) return null;
    
    const winningEnsemble = results[0];
    
    // Récupérer des informations supplémentaires sur l'ensemble gagnant
    try {
      const { data: ensembleData } = await supabase
        .from('tenues')
        .select(`
          nom,
          user_id,
          profiles:user_id(email)
        `)
        .eq('id', winningEnsemble.ensembleId)
        .single();
      
      if (ensembleData) {
        winningEnsemble.ensembleName = ensembleData.nom;
        
        // Fix: Access email property correctly - profiles could be an array or an object
        if (ensembleData.profiles) {
          // Check if profiles is an array
          if (Array.isArray(ensembleData.profiles)) {
            // Access the first element's email if it exists
            winningEnsemble.userName = ensembleData.profiles.length > 0 && ensembleData.profiles[0]?.email 
              ? ensembleData.profiles[0].email 
              : 'Utilisateur inconnu';
          } else {
            // If profiles is an object, access email directly
            winningEnsemble.userName = ensembleData.profiles.email || 'Utilisateur inconnu';
          }
        } else {
          winningEnsemble.userName = 'Utilisateur inconnu';
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des détails de l'ensemble gagnant:", error);
    }
    
    return winningEnsemble;
  } catch (error) {
    console.error("Erreur lors de la récupération du gagnant:", error);
    return null;
  }
};
