
import { supabase } from '@/lib/supabase';

/**
 * Récupère l'ensemble gagnant pour un défi
 */
export const getWinningEnsemble = async (defiId: number) => {
  try {
    // Récupérer toutes les participations pour ce défi
    const { data: participations, error: participationsError } = await supabase
      .from('defi_participations')
      .select(`
        id, 
        ensemble_id,
        user_id,
        tenue:ensemble_id(
          id,
          nom,
          description,
          user_id
        )
      `)
      .eq('defi_id', defiId);
    
    if (participationsError) throw participationsError;
    
    if (!participations || participations.length === 0) {
      return null;
    }
    
    // Créer un tableau pour stocker les scores
    const scores: { [key: number]: number } = {};
    
    // Pour chaque ensemble, récupérer les votes
    for (const participation of participations) {
      const ensembleId = participation.ensemble_id;
      
      // Obtenir les votes pour cet ensemble dans ce défi
      const { data: votes, error: votesError } = await supabase
        .from('defi_votes')
        .select('vote_type')
        .eq('defi_id', defiId)
        .eq('tenue_id', ensembleId);  // Utiliser tenue_id au lieu de ensemble_id
      
      if (votesError) throw votesError;
      
      // Calculer le score (votes positifs - votes négatifs)
      const upVotes = votes.filter(v => v.vote_type === 'up').length;
      const downVotes = votes.filter(v => v.vote_type === 'down').length;
      const score = upVotes - downVotes;
      
      scores[ensembleId] = score;
    }
    
    // Trouver l'ID de l'ensemble avec le score le plus élevé
    let maxScore = -Infinity;
    let winningEnsembleId: number | null = null;
    
    for (const [ensembleId, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        winningEnsembleId = parseInt(ensembleId);
      }
    }
    
    // Si tous les scores sont négatifs ou nuls, il n'y a pas de gagnant
    if (maxScore <= 0) {
      return null;
    }
    
    // Trouver l'ensemble gagnant
    const winningParticipation = participations.find(p => p.ensemble_id === winningEnsembleId);
    
    if (!winningParticipation) {
      return null;
    }
    
    // Récupérer les informations de l'utilisateur gagnant
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', winningParticipation.user_id)
      .maybeSingle();  // Utiliser maybeSingle() au lieu de single()
    
    if (userError) throw userError;
    
    // Fix: Access properties from tenue object, not as an array
    const tenue = winningParticipation.tenue;
    
    return {
      ...tenue,
      user_email: userData?.email,
      score: maxScore,
      ensembleName: tenue?.nom || `Ensemble #${winningEnsembleId}`
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'ensemble gagnant:', error);
    return null;
  }
};
