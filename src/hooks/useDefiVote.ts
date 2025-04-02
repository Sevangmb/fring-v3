
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";
import { 
  getDefiParticipationsWithVotes, 
  ParticipationWithVotes 
} from "@/services/defi/votes/getDefiParticipationsWithVotes";
import { submitVote } from "@/services/defi/votes/submitVote";
import { calculateScore } from "@/services/defi/votes/utils";

interface VoteCount {
  up: number;
  down: number;
}

interface UseDefiVoteReturn {
  participations: ParticipationWithVotes[];
  voteCounts: Record<number, VoteCount>;
  userVotes: Record<number, VoteType>;
  isLoadingParticipations: boolean;
  isVoting: boolean;
  loadParticipations: () => Promise<void>;
  handleVote: (participationId: number, vote: VoteType) => Promise<void>;
  getScore: (upVotes: number, downVotes: number) => number;
  rankings: { id: number; score: number; position: number }[];
}

export function useDefiVote(defiId: number): UseDefiVoteReturn {
  const [participations, setParticipations] = useState<ParticipationWithVotes[]>([]);
  const [voteCounts, setVoteCounts] = useState<Record<number, VoteCount>>({});
  const [userVotes, setUserVotes] = useState<Record<number, VoteType>>({});
  const [isLoadingParticipations, setIsLoadingParticipations] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const { toast } = useToast();

  const loadParticipations = useCallback(async () => {
    if (!defiId) return;

    try {
      setIsLoadingParticipations(true);
      const data = await getDefiParticipationsWithVotes(defiId);
      
      setParticipations(data);
      
      // Extract vote counts and user votes
      const newVoteCounts: Record<number, VoteCount> = {};
      const newUserVotes: Record<number, VoteType> = {};
      
      data.forEach(participation => {
        newVoteCounts[participation.id] = {
          up: participation.votes?.filter(v => v.vote_type === 'up').length || 0,
          down: participation.votes?.filter(v => v.vote_type === 'down').length || 0
        };
        
        // Find user's vote if any
        const userVote = participation.votes?.find(v => v.is_user_vote);
        if (userVote) {
          newUserVotes[participation.id] = userVote.vote_type as VoteType;
        }
      });
      
      setVoteCounts(newVoteCounts);
      setUserVotes(newUserVotes);
    } catch (error) {
      console.error('Error loading defi participations:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les participations du défi',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingParticipations(false);
    }
  }, [defiId, toast]);

  useEffect(() => {
    loadParticipations();
  }, [loadParticipations]);

  const handleVote = async (participationId: number, vote: VoteType) => {
    try {
      setIsVoting(true);
      
      await submitVote('defi', participationId, vote);
      
      // Update local state to reflect the new vote
      setUserVotes(prev => ({
        ...prev,
        [participationId]: vote
      }));
      
      // Update vote counts
      setVoteCounts(prev => {
        const newCounts = { ...prev };
        const currentParticipationCounts = newCounts[participationId] || { up: 0, down: 0 };
        const previousVote = userVotes[participationId];
        
        // Remove previous vote if it exists
        if (previousVote) {
          if (previousVote === 'up') {
            currentParticipationCounts.up = Math.max(0, currentParticipationCounts.up - 1);
          } else if (previousVote === 'down') {
            currentParticipationCounts.down = Math.max(0, currentParticipationCounts.down - 1);
          }
        }
        
        // Add new vote
        if (vote === 'up') {
          currentParticipationCounts.up += 1;
        } else if (vote === 'down') {
          currentParticipationCounts.down += 1;
        }
        
        newCounts[participationId] = currentParticipationCounts;
        return newCounts;
      });
      
      toast({
        title: 'Vote enregistré',
        description: 'Votre vote a été pris en compte',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error voting for participation:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'enregistrer votre vote',
        variant: 'destructive',
      });
    } finally {
      setIsVoting(false);
    }
  };

  const getScore = useCallback((upVotes: number, downVotes: number) => {
    return calculateScore(upVotes, downVotes);
  }, []);

  // Calculate rankings
  const rankings = useMemo(() => {
    const scores = Object.entries(voteCounts).map(([id, counts]) => ({
      id: parseInt(id),
      score: getScore(counts.up, counts.down)
    }));
    
    // Sort by score (highest first)
    const sortedScores = [...scores].sort((a, b) => b.score - a.score);
    
    // Add position
    return sortedScores.map((item, index) => ({
      ...item,
      position: index + 1
    }));
  }, [voteCounts, getScore]);

  return {
    participations,
    voteCounts,
    userVotes,
    isLoadingParticipations,
    isVoting,
    loadParticipations,
    handleVote,
    getScore,
    rankings
  };
}

// Add missing import
import { useMemo } from 'react';
