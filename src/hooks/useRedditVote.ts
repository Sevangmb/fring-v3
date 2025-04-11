
import { useState, useEffect, useCallback } from 'react';
import { VoteType, EntityType, VoteCount } from '@/services/votes/types';
import { useToast } from '@/hooks/use-toast';
import { calculateScore } from '@/services/votes/types';
import { writeLog } from '@/services/logs';

interface UseRedditVoteProps {
  entityType: EntityType;
  entityId: number;
  defiId?: number;
  initialVote?: VoteType;
  initialVotesCount?: VoteCount;
  onVoteSuccess?: (vote: VoteType) => void;
}

export function useRedditVote({
  entityType,
  entityId,
  defiId,
  initialVote = null,
  initialVotesCount = { up: 0, down: 0 },
  onVoteSuccess
}: UseRedditVoteProps) {
  const [userVote, setUserVote] = useState<VoteType>(initialVote);
  const [votesCount, setVotesCount] = useState<VoteCount>(initialVotesCount);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Calculate score
  const score = calculateScore(votesCount);
  
  // Load initial vote data
  useEffect(() => {
    const loadVoteData = async () => {
      if (!entityId) return;
      
      try {
        setIsLoading(true);
        
        // Import dynamically to avoid circular dependencies
        const { getUserVote } = await import('@/services/votes/getUserVote');
        const { getVotesCount } = await import('@/services/votes/getVotesCount');
        
        // Get user's vote
        const vote = await getUserVote(
          entityType === 'tenue' ? 'ensemble' : entityType, 
          entityId,
          defiId
        );
        
        // Get vote counts
        const counts = await getVotesCount(
          entityType === 'tenue' ? 'ensemble' : entityType, 
          entityId,
          defiId
        );
        
        setUserVote(vote);
        setVotesCount(counts);
        setError(null);
      } catch (err) {
        console.error('Error loading vote data:', err);
        setError('Failed to load vote data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVoteData();
  }, [entityType, entityId, defiId]);
  
  // Handle upvote
  const handleUpvote = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Determine the new vote value
      // If already upvoted, remove vote (null). Otherwise, upvote
      const newVote: VoteType = userVote === 'up' ? null : 'up';
      
      // Optimistically update UI
      setUserVote(newVote);
      
      // Update vote counts optimistically
      setVotesCount(prev => {
        const updated = { ...prev };
        
        if (userVote === 'up') {
          // Remove upvote
          updated.up = Math.max(0, updated.up - 1);
        } else if (userVote === 'down') {
          // Change from downvote to upvote
          updated.down = Math.max(0, updated.down - 1);
          updated.up += 1;
        } else {
          // New upvote
          updated.up += 1;
        }
        
        return updated;
      });
      
      // Import dynamically to avoid circular dependencies
      const { submitVote } = await import('@/services/votes/submitVote');
      
      // Submit the vote
      await submitVote(
        entityType === 'tenue' ? 'ensemble' : entityType,
        entityId,
        newVote,
        defiId
      );
      
      if (onVoteSuccess) {
        onVoteSuccess(newVote);
      }
      
      // Log the action
      writeLog(
        `Vote ${newVote === 'up' ? 'positif' : 'retiré'} pour ${entityType}`,
        'info',
        `Entity ID: ${entityId}`,
        'votes'
      );
      
      // Only show toast for adding/changing votes, not removing
      if (userVote !== 'up') {
        toast({
          title: newVote === 'up' ? 'Vote positif' : 'Vote retiré',
          description: newVote === 'up' ? 'Vous avez aimé cet élément' : 'Vous avez retiré votre vote',
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error during vote:', err);
      setError('Failed to submit vote');
      
      // Revert optimistic updates
      // Reload vote data to ensure consistency
      const { getUserVote, getVotesCount } = await import('@/services/votes/voteService');
      
      const vote = await getUserVote(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      const counts = await getVotesCount(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      setUserVote(vote);
      setVotesCount(counts);
      
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du vote',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, defiId, userVote, isLoading, onVoteSuccess, toast]);
  
  // Handle downvote
  const handleDownvote = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Determine the new vote value
      // If already downvoted, remove vote (null). Otherwise, downvote
      const newVote: VoteType = userVote === 'down' ? null : 'down';
      
      // Optimistically update UI
      setUserVote(newVote);
      
      // Update vote counts optimistically
      setVotesCount(prev => {
        const updated = { ...prev };
        
        if (userVote === 'down') {
          // Remove downvote
          updated.down = Math.max(0, updated.down - 1);
        } else if (userVote === 'up') {
          // Change from upvote to downvote
          updated.up = Math.max(0, updated.up - 1);
          updated.down += 1;
        } else {
          // New downvote
          updated.down += 1;
        }
        
        return updated;
      });
      
      // Import dynamically to avoid circular dependencies
      const { submitVote } = await import('@/services/votes/submitVote');
      
      // Submit the vote
      await submitVote(
        entityType === 'tenue' ? 'ensemble' : entityType,
        entityId,
        newVote,
        defiId
      );
      
      if (onVoteSuccess) {
        onVoteSuccess(newVote);
      }
      
      // Log the action
      writeLog(
        `Vote ${newVote === 'down' ? 'négatif' : 'retiré'} pour ${entityType}`,
        'info',
        `Entity ID: ${entityId}`,
        'votes'
      );
      
      // Only show toast for adding/changing votes, not removing
      if (userVote !== 'down') {
        toast({
          title: newVote === 'down' ? 'Vote négatif' : 'Vote retiré',
          description: newVote === 'down' ? 'Vous n\'avez pas aimé cet élément' : 'Vous avez retiré votre vote',
        });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error during vote:', err);
      setError('Failed to submit vote');
      
      // Revert optimistic updates
      // Reload vote data to ensure consistency
      const { getUserVote, getVotesCount } = await import('@/services/votes/voteService');
      
      const vote = await getUserVote(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      const counts = await getVotesCount(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      setUserVote(vote);
      setVotesCount(counts);
      
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du vote',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, defiId, userVote, isLoading, onVoteSuccess, toast]);

  return {
    userVote,
    votesCount,
    score,
    isLoading,
    error,
    handleUpvote,
    handleDownvote,
    refresh: useCallback(async () => {
      const { getUserVote, getVotesCount } = await import('@/services/votes/voteService');
      
      const vote = await getUserVote(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      const counts = await getVotesCount(
        entityType === 'tenue' ? 'ensemble' : entityType, 
        entityId,
        defiId
      );
      
      setUserVote(vote);
      setVotesCount(counts);
    }, [entityType, entityId, defiId])
  };
}
