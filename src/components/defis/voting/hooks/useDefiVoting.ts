
import { useState, useEffect } from 'react';
import { submitVote } from '@/services/defi/votes';
import { getDefiParticipationsWithVotes } from '@/services/defi/votes/getDefiParticipationsWithVotes';
import { VoteType } from '@/services/votes/types';

export const useDefiVoting = (defiId: string | number) => {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [votingInProgress, setVotingInProgress] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Convert string defiId to number
  const numericDefiId = typeof defiId === 'string' ? parseInt(defiId, 10) : defiId;

  // Fetch participations with votes
  useEffect(() => {
    const fetchParticipations = async () => {
      try {
        setLoading(true);
        const data = await getDefiParticipationsWithVotes(numericDefiId);
        setParticipations(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch participations'));
      } finally {
        setLoading(false);
      }
    };

    fetchParticipations();
  }, [numericDefiId]);

  // Vote for an ensemble
  const handleVote = async (ensembleId: number, voteType: VoteType) => {
    try {
      setVotingInProgress(true);
      await submitVote(numericDefiId, voteType, ensembleId);
      
      // Refresh participations after voting
      const updatedParticipations = await getDefiParticipationsWithVotes(numericDefiId);
      setParticipations(updatedParticipations);
      
      return true;
    } catch (err) {
      console.error('Failed to submit vote:', err);
      return false;
    } finally {
      setVotingInProgress(false);
    }
  };

  // Handle moving to the next ensemble
  const handleNext = () => {
    if (currentIndex < participations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Handle moving to the previous ensemble
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return {
    participations,
    loading,
    error,
    votingInProgress,
    currentIndex,
    currentParticipation: participations[currentIndex],
    handleVote,
    handleNext,
    handlePrevious,
    isFirst: currentIndex === 0,
    isLast: currentIndex === participations.length - 1,
    totalCount: participations.length
  };
};
