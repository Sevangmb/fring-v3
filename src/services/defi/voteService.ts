
import { supabase } from '@/lib/supabase';

export interface Vote {
  id?: number;
  defi_id: number;
  ensemble_id: number;
  user_id: string;
  vote: 'up' | 'down';
  created_at?: string;
}

/**
 * Soumettre un vote pour un ensemble dans un défi
 */
export const submitVote = async (
  defiId: number, 
  ensembleId: number, 
  vote: 'up' | 'down'
): Promise<boolean> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) {
      throw new Error('Vous devez être connecté pour voter');
    }

    // Vérifier si l'utilisateur a déjà voté pour cet ensemble dans ce défi
    const { data: existingVote } = await supabase
      .from('defi_votes')
      .select('id')
      .eq('defi_id', defiId)
      .eq('ensemble_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingVote) {
      // Mettre à jour le vote existant
      const { error } = await supabase
        .from('defi_votes')
        .update({ vote })
        .eq('id', existingVote.id);
      
      if (error) throw error;
    } else {
      // Créer un nouveau vote
      const { error } = await supabase
        .from('defi_votes')
        .insert({
          defi_id: defiId,
          ensemble_id: ensembleId,
          user_id: userId,
          vote
        });
      
      if (error) throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors du vote:', error);
    return false;
  }
};

/**
 * Récupérer les votes pour un défi
 */
export const getDefiVotes = async (defiId: number): Promise<Record<number, { up: number, down: number }>> => {
  try {
    const { data, error } = await supabase
      .from('defi_votes')
      .select('ensemble_id, vote')
      .eq('defi_id', defiId);
    
    if (error) throw error;
    
    // Agréger les votes par ensemble
    const votes: Record<number, { up: number, down: number }> = {};
    
    data.forEach(item => {
      if (!votes[item.ensemble_id]) {
        votes[item.ensemble_id] = { up: 0, down: 0 };
      }
      
      if (item.vote === 'up') {
        votes[item.ensemble_id].up += 1;
      } else {
        votes[item.ensemble_id].down += 1;
      }
    });
    
    return votes;
  } catch (error) {
    console.error('Erreur lors de la récupération des votes:', error);
    return {};
  }
};

/**
 * Vérifier si l'utilisateur a déjà voté pour un ensemble dans un défi
 */
export const getUserVote = async (
  defiId: number, 
  ensembleId: number
): Promise<'up' | 'down' | null> => {
  try {
    // Récupérer l'utilisateur actuel
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    
    if (!userId) return null;
    
    const { data, error } = await supabase
      .from('defi_votes')
      .select('vote')
      .eq('defi_id', defiId)
      .eq('ensemble_id', ensembleId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) throw error;
    
    return data ? data.vote : null;
  } catch (error) {
    console.error('Erreur lors de la vérification du vote:', error);
    return null;
  }
};

/**
 * Récupérer les ensembles participants à un défi avec leurs votes
 */
export const getDefiParticipationsWithVotes = async (defiId: number) => {
  try {
    // Récupérer les participations
    const { data: participations, error } = await supabase
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
    
    if (error) throw error;
    
    // Récupérer les votes pour ce défi
    const votes = await getDefiVotes(defiId);
    
    // Enrichir les participations avec les votes
    const enrichedParticipations = await Promise.all(participations.map(async (participation) => {
      // Obtenir les détails de l'ensemble
      const { data: ensemble } = await supabase
        .from('tenues')
        .select(`
          id, 
          nom, 
          description, 
          occasion, 
          saison, 
          created_at, 
          user_id
        `)
        .eq('id', participation.ensemble_id)
        .single();
      
      // Calculer le score
      const ensembleVotes = votes[participation.ensemble_id] || { up: 0, down: 0 };
      const score = ensembleVotes.up - ensembleVotes.down;
      
      return {
        ...participation,
        ensemble,
        votes: ensembleVotes,
        score
      };
    }));
    
    // Trier par score descendant
    return enrichedParticipations.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Erreur lors de la récupération des participations avec votes:', error);
    return [];
  }
};
