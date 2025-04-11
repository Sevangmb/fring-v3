
import { useState, useEffect, useCallback } from 'react';
import { VoteType, EntityType } from '@/services/votes/types';
import { useToast } from '@/hooks/use-toast';

interface UseRedditVoteProps {
  entityType: EntityType;
  entityId: number;
  defiId?: number;
  initialVote?: VoteType;
  onVoteSuccess?: (vote: VoteType) => void;
}

export function useRedditVote({
  entityType,
  entityId,
  defiId,
  initialVote = null,
  onVoteSuccess
}: UseRedditVoteProps) {
  const [userVote, setUserVote] = useState<VoteType>(initialVote);
  const [score, setScore] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Charger le vote initial et le score
  useEffect(() => {
    const loadVoteData = async () => {
      if (!entityId) return;
      
      try {
        setIsLoading(true);
        
        // Import dynamiquement pour éviter des dépendances circulaires
        const { getUserVote } = await import('@/services/votes/getUserVote');
        const { getVotesCount } = await import('@/services/votes/getVotesCount');
        
        // Récupérer le vote de l'utilisateur
        const vote = await getUserVote(
          entityType === 'tenue' ? 'ensemble' : entityType, 
          entityId,
          defiId
        );
        
        // Récupérer le nombre de votes
        const counts = await getVotesCount(
          entityType === 'tenue' ? 'ensemble' : entityType, 
          entityId,
          defiId
        );
        
        setUserVote(vote);
        setScore(counts.up - counts.down);
      } catch (err) {
        console.error('Erreur lors du chargement des données de vote:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVoteData();
  }, [entityType, entityId, defiId]);
  
  // Gérer un upvote
  const handleUpvote = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Déterminer la nouvelle valeur du vote
      // Si déjà upvoté, retirer le vote (null). Sinon, upvoter
      const newVote: VoteType = userVote === 'up' ? null : 'up';
      
      // Mettre à jour l'UI de manière optimiste
      setUserVote(newVote);
      
      // Mettre à jour le score de manière optimiste
      setScore(prevScore => {
        if (userVote === 'up') {
          // Retrait d'un upvote
          return prevScore - 1;
        } else if (userVote === 'down') {
          // Changement de downvote à upvote (+2)
          return prevScore + 2;
        } else {
          // Nouveau upvote
          return prevScore + 1;
        }
      });
      
      // Import dynamiquement pour éviter des dépendances circulaires
      const { submitVote } = await import('@/services/votes/submitVote');
      
      // Soumettre le vote
      await submitVote(
        entityType === 'tenue' ? 'ensemble' : entityType,
        entityId,
        newVote,
        defiId
      );
      
      if (onVoteSuccess) {
        onVoteSuccess(newVote);
      }
      
      // Afficher un toast uniquement pour l'ajout de vote, pas pour le retrait
      if (userVote !== 'up' && newVote === 'up') {
        toast({
          title: 'Vote positif',
          description: 'Vous avez aimé cet élément',
        });
      }
    } catch (err) {
      console.error('Erreur lors du vote:', err);
      
      // Annuler les mises à jour optimistes
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
      setScore(counts.up - counts.down);
      
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'enregistrement du vote',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, defiId, userVote, isLoading, onVoteSuccess, toast]);
  
  // Gérer un downvote
  const handleDownvote = useCallback(async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      
      // Déterminer la nouvelle valeur du vote
      // Si déjà downvoté, retirer le vote (null). Sinon, downvoter
      const newVote: VoteType = userVote === 'down' ? null : 'down';
      
      // Mettre à jour l'UI de manière optimiste
      setUserVote(newVote);
      
      // Mettre à jour le score de manière optimiste
      setScore(prevScore => {
        if (userVote === 'down') {
          // Retrait d'un downvote
          return prevScore + 1;
        } else if (userVote === 'up') {
          // Changement de upvote à downvote (-2)
          return prevScore - 2;
        } else {
          // Nouveau downvote
          return prevScore - 1;
        }
      });
      
      // Import dynamiquement pour éviter des dépendances circulaires
      const { submitVote } = await import('@/services/votes/submitVote');
      
      // Soumettre le vote
      await submitVote(
        entityType === 'tenue' ? 'ensemble' : entityType,
        entityId,
        newVote,
        defiId
      );
      
      if (onVoteSuccess) {
        onVoteSuccess(newVote);
      }
      
      // Afficher un toast uniquement pour l'ajout de vote, pas pour le retrait
      if (userVote !== 'down' && newVote === 'down') {
        toast({
          title: 'Vote négatif',
          description: 'Vous n\'avez pas aimé cet élément',
        });
      }
    } catch (err) {
      console.error('Erreur lors du vote:', err);
      
      // Annuler les mises à jour optimistes
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
      setScore(counts.up - counts.down);
      
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
    score,
    isLoading,
    handleUpvote,
    handleDownvote
  };
}
