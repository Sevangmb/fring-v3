
import { useState, useEffect, useCallback } from 'react';
import { VoteType, EntityType } from '@/services/votes/types';
import { submitVote, getUserVote, getVotesCount } from '@/services/votes/voteService';
import { useToast } from './use-toast';

interface UseVoteOptions {
  onVoteSuccess?: (vote: VoteType) => void;
  onVoteError?: (error: Error) => void;
}

export function useVote(
  entityType: EntityType,
  entityId: number,
  options?: UseVoteOptions
) {
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votesCount, setVotesCount] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { toast } = useToast();

  // Vérifier la connectivité
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Charger les données de vote initiales
  const loadVoteData = useCallback(async () => {
    if (!entityId || isOffline) return;

    try {
      const [voteData, countsData] = await Promise.all([
        getUserVote(entityType, entityId),
        getVotesCount(entityType, entityId)
      ]);

      setUserVote(voteData);
      setVotesCount(countsData);
    } catch (error) {
      console.error('Erreur lors du chargement des votes:', error);
    }
  }, [entityType, entityId, isOffline]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);

  // Fonction pour soumettre un vote
  const handleSubmitVote = useCallback(async (vote: VoteType) => {
    if (isOffline) {
      toast({
        title: 'Erreur de connexion',
        description: 'Vous êtes hors ligne. Veuillez vérifier votre connexion internet.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await submitVote(entityType, entityId, vote);
      
      // Mettre à jour l'état local
      setUserVote(vote);
      
      // Mettre à jour le compte de votes
      setVotesCount(prev => {
        const newCounts = { ...prev };
        
        // Si l'utilisateur change son vote
        if (userVote) {
          if (userVote === 'up') newCounts.up = Math.max(0, newCounts.up - 1);
          if (userVote === 'down') newCounts.down = Math.max(0, newCounts.down - 1);
        }
        
        // Ajouter le nouveau vote
        if (vote === 'up') newCounts.up += 1;
        if (vote === 'down') newCounts.down += 1;
        
        return newCounts;
      });
      
      // Appeler le callback de succès si défini
      if (options?.onVoteSuccess) {
        options.onVoteSuccess(vote);
      }
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      
      // Afficher une notification d'erreur
      toast({
        title: 'Erreur',
        description: error instanceof Error 
          ? error.message 
          : 'Une erreur est survenue lors du vote',
        variant: 'destructive',
      });
      
      // Appeler le callback d'erreur si défini
      if (options?.onVoteError && error instanceof Error) {
        options.onVoteError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, userVote, isOffline, options, toast]);

  return {
    userVote,
    votesCount,
    isLoading,
    isOffline,
    submitVote: handleSubmitVote,
    loadVoteData
  };
}
