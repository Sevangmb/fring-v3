
import { supabase } from '@/lib/supabase';
import { fetchWithRetry } from '@/services/network/retryUtils';
import { getUserVote } from './getUserVote';
import { getVotesCount } from '@/services/votes/getVotesCount';
import { VoteType } from './types';

/**
 * Récupère les participations à un défi avec les votes
 */
export const getDefiParticipationsWithVotes = async (defiId: number) => {
  try {
    // Récupérer toutes les participations pour ce défi
    const { data: participations, error: participationsError } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('defi_participations')
          .select(`
            id, 
            defi_id,
            user_id,
            ensemble_id,
            created_at,
            tenue:ensemble_id(
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
            )
          `)
          .eq('defi_id', defiId)
          .order('created_at', { ascending: false });
      }
    );
    
    if (participationsError) throw participationsError;
    
    if (!participations || participations.length === 0) {
      return [];
    }
    
    // Récupérer les informations des utilisateurs
    const userIds = participations.map(p => p.user_id);
    const { data: usersData, error: usersError } = await fetchWithRetry(
      async () => {
        return await supabase
          .from('profiles')
          .select('id, email')
          .in('id', userIds);
      }
    );
    
    if (usersError) throw usersError;
    
    // Créer un mapping des utilisateurs
    const userMap = new Map();
    usersData?.forEach(user => {
      userMap.set(user.id, user);
    });
    
    // Pour chaque participation, récupérer les votes de l'utilisateur actuel
    // et le compte total des votes
    const participationsWithVotes = await Promise.all(participations.map(async (participation) => {
      const ensembleId = participation.ensemble_id;
      const userData = userMap.get(participation.user_id);
      
      // Votes pour cet ensemble dans ce défi
      const userVote = await getUserVote(defiId, ensembleId);
      const votesCount = await getVotesCount('defi', defiId, ensembleId);
      
      return {
        ...participation,
        tenue: {
          ...participation.tenue,
          vetements: participation.tenue.vetements
        },
        user_email: userData?.email || 'Utilisateur inconnu',
        votes: {
          userVote,
          votesCount
        }
      };
    }));
    
    return participationsWithVotes;
  } catch (error) {
    console.error('Erreur lors de la récupération des participations avec votes:', error);
    return [];
  }
};
