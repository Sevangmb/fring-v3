
import { supabase } from "@/lib/supabase";
import { fetchWithRetry } from "@/services/network/retryUtils";
import { ParticipationWithVotes } from "./types";
import { calculateScore } from "./utils";

/**
 * Récupérer les participations à un défi avec les informations de votes
 */
export const getDefiParticipationsWithVotes = async (defiId: number): Promise<ParticipationWithVotes[]> => {
  try {
    // Récupérer les participations pour ce défi
    const { data: participationsData, error: participationsError } = await fetchWithRetry(
      async () => {
        return await supabase
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
      }
    );
    
    if (participationsError) throw participationsError;
    
    // Récupérer les détails pour chaque participation
    const participationsWithDetails = await Promise.all(participationsData.map(async (participation) => {
      // Récupérer les détails de l'ensemble
      const { data: ensemble } = await fetchWithRetry(
        async () => {
          return await supabase
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
                tenues_vetements.id,
                vetement:vetement_id(*),
                position_ordre
              )
            `)
            .eq('id', participation.ensemble_id)
            .single();
        }
      );
      
      // Récupérer les votes pour cet ensemble
      const { data: votesData } = await fetchWithRetry(
        async () => {
          return await supabase
            .from('defi_votes')
            .select('vote')
            .eq('ensemble_id', participation.ensemble_id);
        }
      );
      
      // Compter les votes
      const votes = {
        up: votesData?.filter(v => v.vote === 'up').length || 0,
        down: votesData?.filter(v => v.vote === 'down').length || 0
      };
      
      // Calculer le score
      const score = calculateScore(votes);
      
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
