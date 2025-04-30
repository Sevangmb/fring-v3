
import { supabase } from '@/lib/supabase';
import { getUserVote } from '@/services/votes/getUserVote';
import { getVotesCount } from '@/services/votes/getVotesCount';

export interface ParticipationWithVotes {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
  ensemble?: any;
  votes?: {
    up: number;
    down: number;
  };
  userVote?: 'up' | 'down' | null;
  score?: number;
}

/**
 * Récupère les participations à un défi avec leur nombre de votes
 * @param defiId ID du défi
 * @returns Tableau de participations avec les votes
 */
export const getDefiParticipationsWithVotes = async (defiId: number): Promise<ParticipationWithVotes[]> => {
  try {
    // Récupérer les participations avec les informations sur les ensembles
    const { data: participations, error } = await supabase
      .from('defi_participations')
      .select(`
        id,
        defi_id,
        user_id,
        ensemble_id,
        commentaire,
        created_at,
        ensemble:ensemble_id(
          id,
          nom,
          description,
          occasion,
          saison,
          created_at,
          user_id,
          image_url,
          vetements:tenues_vetements(
            id,
            vetement:vetement_id(*),
            position_ordre
          )
        )
      `)
      .eq('defi_id', defiId);
    
    if (error) {
      console.error('Erreur lors de la récupération des participations:', error);
      return [];
    }
    
    if (!participations || participations.length === 0) {
      return [];
    }
    
    // Récupérer les votes pour chaque ensemble
    const enrichedParticipations = await Promise.all(participations.map(async (p) => {
      try {
        if (!p.ensemble_id) return p;
        
        // Récupérer le vote de l'utilisateur actuel
        const userVote = await getUserVote('ensemble', p.ensemble_id);
        
        // Récupérer le nombre de votes pour l'ensemble
        const votes = await getVotesCount('ensemble', p.ensemble_id);
        
        // Calculer le score (upvotes - downvotes)
        const score = votes.up - votes.down;
        
        return {
          ...p,
          userVote,
          votes,
          score
        };
      } catch (error) {
        console.error(`Erreur lors de l'enrichissement de la participation ${p.id}:`, error);
        return p;
      }
    }));
    
    return enrichedParticipations;
  } catch (error) {
    console.error('Erreur lors de la récupération des participations avec votes:', error);
    return [];
  }
};

/**
 * Vérifie si l'utilisateur participe déjà à un défi
 */
export const checkUserParticipation = async (defiId: number): Promise<{participe: boolean, ensembleId?: number}> => {
  try {
    // Vérifier si l'utilisateur est connecté
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;
    
    if (!userId) {
      return { participe: false };
    }
    
    // Vérifier si l'utilisateur a déjà soumis un ensemble pour ce défi
    const { data, error } = await supabase
      .from('defi_participations')
      .select('ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error('Erreur lors de la vérification de participation:', error);
      return { participe: false };
    }
    
    return { 
      participe: !!data, 
      ensembleId: data?.ensemble_id
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de participation:', error);
    return { participe: false };
  }
};
