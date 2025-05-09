
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { submitVote } from '@/services/defi/votes/submitVote';
import { VoteType } from '@/services/votes/types';
import { ParticipationWithVotes } from '@/services/defi/votes/getDefiParticipationsWithVotes';

export const useDefiVote = (defiId: number, participations: ParticipationWithVotes[]) => {
  const [voting, setVoting] = useState(false);
  const [votedParticipations, setVotedParticipations] = useState<number[]>([]);
  const { toast } = useToast();

  /**
   * Computes vote statistics from participations
   */
  const getVoteStats = () => {
    if (!participations || participations.length === 0) {
      return {
        totalVotes: 0,
        totalParticipations: 0,
        topVoted: null
      };
    }

    // Get total votes across all participations
    const totalVotes = participations.reduce((sum, p) => 
      sum + p.votes.up + p.votes.down, 0);

    // Find top voted participation
    let topVoted = participations[0];
    
    for (const p of participations) {
      if (p.score > topVoted.score) {
        topVoted = p;
      }
    }

    return {
      totalVotes,
      totalParticipations: participations.length,
      topVoted
    };
  };

  /**
   * Submit a vote for a particular participation
   */
  const handleVote = async (ensembleId: number, voteType: VoteType) => {
    if (voting) return;
    
    try {
      setVoting(true);
      
      // Utiliser le service correct - s'assurer qu'un vote_type est fourni
      if (!voteType) {
        throw new Error("Type de vote non spécifié");
      }
      
      // Soumettre le vote au backend
      const success = await submitVote(defiId, ensembleId, voteType);
      
      if (!success) {
        throw new Error("Échec lors de l'enregistrement du vote");
      }
      
      // Update the local state
      setVotedParticipations(prev => [...prev, ensembleId]);
      
      // Show success toast
      toast({
        title: "Vote enregistré",
        description: `Votre vote a été enregistré avec succès.`,
        variant: "default"
      });
      
      return true;
    } catch (error) {
      console.error('Error submitting vote:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre vote.",
        variant: "destructive"
      });
      return false;
    } finally {
      setVoting(false);
    }
  };

  return {
    voting,
    votedParticipations,
    handleVote,
    getVoteStats
  };
};
