import { supabase } from '@/lib/supabase';
import { getUserVote } from './getUserVote';
import { VoteCount, calculateScore } from '@/services/votes/types';

export interface ParticipationWithVotes {
  id: number;
  ensembleId: number;
  ensembleName: string;
  description: string | null;
  userId: string;
  createdAt: string;
  userEmail: string;
  vetements: {
    id: number;
    nom: string;
    image_url: string;
    categorie: string;
    couleur: string;
  }[];
  votes: VoteCount;
  score: number;
  userVote: 'up' | 'down' | null;
}

/**
 * Vérifie si un utilisateur a participé à un défi
 * @param defiId ID du défi
 * @param userId ID de l'utilisateur (optionnel, utilise l'utilisateur courant si non fourni)
 * @returns Un objet avec le statut de participation et l'ID de l'ensemble si participé
 */
export const checkUserParticipation = async (
  defiId: number,
  userId?: string
): Promise<{ participe: boolean; ensembleId?: number }> => {
  try {
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession();
      userId = sessionData.session?.user?.id;
      
      if (!userId) {
        return { participe: false };
      }
    }

    const { data, error } = await supabase
      .from('defi_participations')
      .select('ensemble_id')
      .eq('defi_id', defiId)
      .eq('user_id', userId)
      .maybeSingle();

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

/**
 * Récupère les participations à un défi avec leurs votes
 * @param defiId ID du défi
 * @returns Une liste de participations avec les informations de vote
 */
export const getDefiParticipationsWithVotes = async (
  defiId: number, 
  userId?: string
): Promise<ParticipationWithVotes[]> => {
  try {
    const { data: participations, error: participationsError } = await supabase
      .from('defi_participations')
      .select(`
        id,
        defi_id,
        user_id,
        ensemble_id,
        created_at,
        tenues (
          id,
          nom,
          description,
          user_id,
          created_at,
          tenues_vetements (
            id,
            vetement_id,
            position_ordre,
            vetement (
              id,
              nom,
              image_url,
              categorie,
              couleur
            )
          )
        ),
        users (
          email
        )
      `)
      .eq('defi_id', defiId)
      .order('created_at', { ascending: false });

    if (participationsError) {
      console.error('Error fetching participations:', participationsError);
      throw participationsError;
    }

    let currentUserId = userId;
    if (!currentUserId) {
      const { data: sessionData } = await supabase.auth.getSession();
      currentUserId = sessionData.session?.user?.id;
    }

    const participationsWithVotes: ParticipationWithVotes[] = await Promise.all(
      (participations || []).map(async (participation) => {
        if (!participation.tenues || !Array.isArray(participation.tenues) || participation.tenues.length === 0) {
          throw new Error(`No ensemble found for participation ${participation.id}`);
        }

        const ensemble = participation.tenues[0];
        
        let userEmail = '';
        if (participation.users && Array.isArray(participation.users) && participation.users.length > 0) {
          userEmail = participation.users[0]?.email || '';
        }

        const vetements = ensemble.tenues_vetements
          ? ensemble.tenues_vetements.map(item => {
              const vetementData = Array.isArray(item.vetement) ? item.vetement[0] : item.vetement;
              return {
                id: vetementData.id,
                nom: vetementData.nom,
                image_url: vetementData.image_url,
                categorie: vetementData.categorie,
                couleur: vetementData.couleur
              };
            })
          : [];

        const { data: voteData, error: voteError } = await supabase
          .from('defi_votes')
          .select('vote_type')
          .eq('defi_id', defiId)
          .eq('tenue_id', ensemble.id);

        if (voteError) {
          console.error('Error fetching votes:', voteError);
          throw voteError;
        }

        const votes: VoteCount = {
          up: voteData?.filter(v => v.vote_type === 'up').length || 0,
          down: voteData?.filter(v => v.vote_type === 'down').length || 0
        };

        const score = calculateScore(votes);

        const userVote = currentUserId 
          ? await getUserVote(Number(defiId), Number(ensemble.id), currentUserId)
          : null;

        return {
          id: participation.id,
          ensembleId: ensemble.id,
          ensembleName: ensemble.nom,
          description: ensemble.description,
          userId: participation.user_id,
          createdAt: participation.created_at,
          userEmail,
          vetements,
          votes,
          score,
          userVote
        };
      })
    );

    return participationsWithVotes;
  } catch (error) {
    console.error('Error in getDefiParticipationsWithVotes:', error);
    return [];
  }
};
