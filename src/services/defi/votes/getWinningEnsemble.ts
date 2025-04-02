
import { supabase } from '@/lib/supabase';
import { ParticipationWithVotes } from './getDefiParticipationsWithVotes';
import { calculateScore } from './types';

/**
 * Récupère l'ensemble gagnant d'un défi (celui avec le meilleur score)
 * @param defiId ID du défi
 * @returns L'ensemble gagnant ou null si aucun n'est trouvé
 */
export const getWinningEnsemble = async (
  defiId: number,
  participations?: ParticipationWithVotes[]
): Promise<ParticipationWithVotes | null> => {
  try {
    // Si les participations sont déjà fournies, pas besoin de les récupérer
    let participationsToUse = participations;
    
    if (!participationsToUse) {
      // Import dynamique pour éviter les dépendances circulaires
      const { getDefiParticipationsWithVotes } = await import('./getDefiParticipationsWithVotes');
      
      // Récupérer les participations avec leurs votes
      participationsToUse = await getDefiParticipationsWithVotes(defiId);
    }
    
    if (!participationsToUse || participationsToUse.length === 0) {
      return null;
    }
    
    // Trier les participations par score (décroissant)
    const sortedParticipations = [...participationsToUse].sort(
      (a, b) => calculateScore(b.votes) - calculateScore(a.votes)
    );
    
    // Retourner la participation avec le meilleur score
    return sortedParticipations[0];
    
  } catch (error) {
    console.error('Error getting winning ensemble:', error);
    return null;
  }
};
