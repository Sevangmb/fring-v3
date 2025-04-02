
import { supabase } from '@/lib/supabase';

export interface ParticipationWithVotes {
  id: number;
  defi_id: number;
  user_id: string;
  ensemble_id: number;
  created_at: string;
  commentaire?: string;
  tenue: {
    id: number;
    nom: string;
    description?: string;
    occasion?: string;
    saison?: string;
    created_at: string;
    user_id: string;
    vetements: {
      id: number;
      vetement: any;
    }[];
  };
  user_email?: string;
  votes?: {
    vote_type: string;
    is_user_vote: boolean;
  }[];
}

export const getDefiParticipationsWithVotes = async (defiId: number): Promise<ParticipationWithVotes[]> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Récupérer toutes les participations à ce défi
    const { data: participations, error: participationsError } = await supabase
      .from('defi_participations')
      .select(`
        id, 
        defi_id, 
        user_id, 
        ensemble_id, 
        commentaire, 
        created_at,
        user:user_id(email)
      `)
      .eq('defi_id', defiId);

    if (participationsError) throw participationsError;
    
    // Pour chaque participation, récupérer les détails de l'ensemble et les votes
    const participationsWithVotes = await Promise.all(
      participations.map(async (participation) => {
        // Récupérer les détails de l'ensemble
        const { data: ensemble, error: ensembleError } = await supabase
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
              id,
              vetement:vetement_id(*)
            )
          `)
          .eq('id', participation.ensemble_id)
          .single();

        if (ensembleError) {
          console.error("Erreur lors de la récupération de l'ensemble:", ensembleError);
          return {
            ...participation,
            user_email: participation.user?.email,
            tenue: {
              id: 0,
              nom: "Ensemble introuvable",
              created_at: "",
              user_id: "",
              vetements: []
            },
            votes: []
          };
        }

        // Récupérer les votes pour cet ensemble
        const { data: votes, error: votesError } = await supabase
          .from('ensemble_votes')
          .select('id, vote, user_id')
          .eq('ensemble_id', participation.ensemble_id);

        if (votesError) {
          console.error("Erreur lors de la récupération des votes:", votesError);
          return {
            ...participation,
            user_email: participation.user?.email,
            tenue: ensemble,
            votes: []
          };
        }

        // Transformer les votes pour inclure si l'utilisateur courant a voté
        const transformedVotes = votes.map(vote => ({
          vote_type: vote.vote,
          is_user_vote: userId ? vote.user_id === userId : false
        }));

        return {
          ...participation,
          user_email: participation.user?.email,
          tenue: ensemble,
          votes: transformedVotes
        };
      })
    );

    return participationsWithVotes as ParticipationWithVotes[];
  } catch (error) {
    console.error("Erreur lors de la récupération des participations avec votes:", error);
    throw error;
  }
};
