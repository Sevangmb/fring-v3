
import { useState, useCallback, useEffect } from 'react';
import { submitVote } from '@/services/votes';
import { getDefiParticipationsWithVotes, ParticipationWithVotes } from '@/services/defi/votes/getDefiParticipationsWithVotes';
import { VoteType, VoteCount } from '@/services/votes/types';
import { useToast } from './use-toast';

export const useDefiVote = (defiId: string | number) => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<ParticipationWithVotes[]>([]);
  const [userVotes, setUserVotes] = useState<Record<number, VoteType>>({});
  const [voteCounts, setVoteCounts] = useState<Record<number, VoteCount>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [votingInProgress, setVotingInProgress] = useState(false);
  
  // Convert string defiId to number if needed
  const numericDefiId = typeof defiId === 'string' ? parseInt(defiId, 10) : defiId;

  // Load participations and votes
  const loadParticipations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getDefiParticipationsWithVotes(numericDefiId);
      setParticipations(data);
      
      // Process votes data
      const votes: Record<number, VoteType> = {};
      const counts: Record<number, VoteCount> = {};
      
      data.forEach(participation => {
        const ensembleId = participation.ensemble_id;
        
        // Count votes by type
        const upvotes = participation.votes?.filter(v => v.vote_type === 'upvote').length || 0;
        const downvotes = participation.votes?.filter(v => v.vote_type === 'downvote').length || 0;
        
        counts[ensembleId] = { upvotes, downvotes };
        
        // Check if user has voted
        const userVote = participation.votes?.find(v => v.is_user_vote);
        if (userVote) {
          votes[ensembleId] = userVote.vote_type as VoteType;
        }
      });
      
      setUserVotes(votes);
      setVoteCounts(counts);
    } catch (err) {
      console.error('Error loading participations:', err);
      setError(err instanceof Error ? err : new Error('Failed to load participations'));
      
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les participations au défi',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [numericDefiId, toast]);
  
  // Initial load
  useEffect(() => {
    loadParticipations();
  }, [loadParticipations]);
  
  // Handle voting
  const handleVote = useCallback(async (ensembleId: number, voteType: VoteType) => {
    try {
      setVotingInProgress(true);
      
      // Check if user is changing their vote
      const existingVote = userVotes[ensembleId];
      if (existingVote === voteType) {
        // User is clicking the same vote type again, we'll consider this a vote removal
        await submitVote(ensembleId, null); // Pass null to remove vote
      } else {
        // Submit new vote
        await submitVote(ensembleId, voteType);
      }
      
      // Refresh data
      await loadParticipations();
      
      toast({
        title: 'Vote enregistré',
        description: 'Votre vote a été pris en compte',
        variant: 'default'
      });
      
      return true;
    } catch (err) {
      console.error('Error submitting vote:', err);
      
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre vote',
        variant: 'destructive'
      });
      
      return false;
    } finally {
      setVotingInProgress(false);
    }
  }, [userVotes, loadParticipations, toast]);
  
  return {
    participations,
    userVotes,
    voteCounts,
    loading,
    error,
    votingInProgress,
    handleVote,
    refreshData: loadParticipations
  };
};
