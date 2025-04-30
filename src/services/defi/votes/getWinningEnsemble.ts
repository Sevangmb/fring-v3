
import { supabase } from '@/lib/supabase';
import { Defi } from '../types';

interface WinningEnsemble {
  ensembleId: number;
  ensembleNom?: string;
  userId?: string;
  userEmail?: string;
  score: number;
  upvotes: number;
  downvotes: number;
  totalVotes: number;
}

/**
 * Calcule l'ensemble gagnant pour un défi
 * @param defiId ID du défi
 * @returns Infos sur l'ensemble gagnant ou null si aucun vote
 */
export const getWinningEnsemble = async (defiId: number): Promise<WinningEnsemble | null> => {
  try {
    // Vérifier si le défi existe
    const { data: defi, error: defiError } = await supabase
      .from('defis')
      .select('*')
      .eq('id', defiId)
      .single();
      
    if (defiError) {
      console.error('Erreur lors de la récupération du défi:', defiError);
      return null;
    }
      
    // Récupérer tous les votes pour ce défi
    const { data: votes, error: votesError } = await supabase
      .from('defi_votes')
      .select('tenue_id, vote_type')
      .eq('defi_id', defiId)
      .not('tenue_id', 'is', null);
      
    if (votesError) {
      console.error('Erreur lors de la récupération des votes:', votesError);
      return null;
    }
    
    if (!votes || votes.length === 0) {
      console.log('Aucun vote pour ce défi');
      return null;
    }
    
    // Regrouper les votes par ensemble et calculer le score
    const ensembleVotes: Record<number, { up: number, down: number }> = {};
    
    votes.forEach(vote => {
      if (!vote.tenue_id) return;
      
      if (!ensembleVotes[vote.tenue_id]) {
        ensembleVotes[vote.tenue_id] = { up: 0, down: 0 };
      }
      
      if (vote.vote_type === 'up') {
        ensembleVotes[vote.tenue_id].up += 1;
      } else if (vote.vote_type === 'down') {
        ensembleVotes[vote.tenue_id].down += 1;
      }
    });
    
    // Calculer le score pour chaque ensemble
    let maxScore = -Infinity;
    let winningEnsembleIds: number[] = [];
    
    Object.entries(ensembleVotes).forEach(([ensembleId, voteCounts]) => {
      const score = voteCounts.up - voteCounts.down;
      
      if (score > maxScore) {
        maxScore = score;
        winningEnsembleIds = [Number(ensembleId)];
      } else if (score === maxScore) {
        winningEnsembleIds.push(Number(ensembleId));
      }
    });
    
    if (winningEnsembleIds.length === 0) {
      console.log('Aucun gagnant trouvé');
      return null;
    }
    
    // Récupérer les informations sur l'ensemble gagnant
    const winningId = winningEnsembleIds[0];
    const voteCounts = ensembleVotes[winningId];
    
    // Récupérer les informations sur l'ensemble et son créateur
    const { data: ensemble, error: ensembleError } = await supabase
      .from('tenues')
      .select(`
        id, 
        nom, 
        user_id,
        profiles:user_id (email)
      `)
      .eq('id', winningId)
      .single();
    
    if (ensembleError) {
      console.error('Erreur lors de la récupération de l\'ensemble:', ensembleError);
    }
    
    return {
      ensembleId: winningId,
      ensembleNom: ensemble?.nom,
      userId: ensemble?.user_id,
      userEmail: ensemble?.profiles?.email as string,
      score: maxScore,
      upvotes: voteCounts.up,
      downvotes: voteCounts.down,
      totalVotes: voteCounts.up + voteCounts.down
    };
  } catch (error) {
    console.error('Erreur lors du calcul du gagnant:', error);
    return null;
  }
};
