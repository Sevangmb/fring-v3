
import { supabase } from '@/lib/supabase';
import { getUserVote } from './getUserVote';
import { getVotesCount } from '@/services/votes/getVotesCount';

export interface ParticipationWithVotes {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  commentaire?: string;
  created_at: string;
  user_email?: string;
  ensemble: {
    id: number;
    nom: string;
    description?: string;
    user_id: string;
    created_at: string;
    vetements: {
      id: number;
      vetement: {
        id: number;
        nom: string;
        image_url?: string;
        categorie: string;
        couleur?: string;
      };
      position_ordre: number;
    }[];
  };
  votes: {
    up: number;
    down: number;
  };
  score: number;
  userVote?: 'up' | 'down' | null;
}

export const getDefiParticipationsWithVotes = async (defiId: number): Promise<ParticipationWithVotes[]> => {
  try {
    // Fetch participations with ensemble data
    const { data: participations, error } = await supabase
      .from('defis_participations')
      .select(`
        id,
        defi_id,
        user_id,
        ensemble_id,
        commentaire,
        created_at,
        user:user_id (
          email
        ),
        ensemble:ensemble_id (
          id,
          nom,
          description,
          user_id,
          created_at,
          tenues_vetements (
            id, 
            vetement_id,
            position_ordre,
            vetement:vetements (
              id,
              nom,
              image_url,
              categorie,
              couleur
            )
          )
        )
      `)
      .eq('defi_id', defiId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching participations:', error);
      return [];
    }

    // Get user ID for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    const userId = user?.id;

    // Process participations with vote info
    const participationsWithVotes: ParticipationWithVotes[] = await Promise.all(
      participations.map(async (participation) => {
        const ensembleId = participation.ensemble_id;
        
        // Get votes count
        const votesCount = await getVotesCount('ensemble', ensembleId);
        
        // Get user's vote if authenticated
        let userVote = null;
        if (userId) {
          userVote = await getUserVote('ensemble', ensembleId, userId);
        }
        
        // Calculate score (upvotes - downvotes)
        const score = votesCount.up - votesCount.down;
        
        // Format ensemble data
        const formattedEnsemble = {
          id: participation.ensemble.id,
          nom: participation.ensemble.nom,
          description: participation.ensemble.description,
          user_id: participation.ensemble.user_id,
          created_at: participation.ensemble.created_at,
          vetements: participation.ensemble.tenues_vetements.map(item => ({
            id: item.vetement_id,
            vetement: item.vetement,
            position_ordre: item.position_ordre,
          })),
        };
        
        // Get user email from user data
        const userEmail = participation.user?.[0]?.email;
        
        return {
          id: participation.id,
          defi_id: participation.defi_id,
          user_id: participation.user_id,
          ensemble_id: ensembleId,
          commentaire: participation.commentaire,
          created_at: participation.created_at,
          user_email: userEmail,
          ensemble: formattedEnsemble,
          votes: votesCount,
          score,
          userVote,
        };
      })
    );

    // Sort by score in descending order
    return participationsWithVotes.sort((a, b) => b.score - a.score);
  } catch (error) {
    console.error('Error in getDefiParticipationsWithVotes:', error);
    return [];
  }
};

// Check if a user has participated in a defi
export const checkUserParticipation = async (defiId: number, userId: string): Promise<{ participe: boolean; ensembleId?: number }> => {
  try {
    const { data, error } = await supabase
      .from('defis_participations')
      .select('id, ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .single();
      
    if (error || !data) {
      return { participe: false };
    }
    
    return { 
      participe: true,
      ensembleId: data.ensemble_id
    };
  } catch (error) {
    console.error('Error checking user participation:', error);
    return { participe: false };
  }
};
