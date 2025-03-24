
import { useState, useCallback, useEffect } from 'react';
import { 
  submitVote as apiSubmitVote, 
  getUserVote, 
  getVotesCount 
} from '@/services/votes/voteService';
import { VoteType, EntityType, VotesCount } from '@/services/votes/types';
import { useToast } from './use-toast';

interface UseVoteOptions {
  onVoteSuccess?: (vote: VoteType) => void;
  initialVote?: VoteType;
}

export const useVote = (
  entityType: EntityType,
  entityId: number,
  options?: UseVoteOptions
) => {
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<VoteType>(options?.initialVote || null);
  const [votesCount, setVotesCount] = useState<VotesCount>({ up: 0, down: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const loadVoteData = useCallback(async () => {
    if (!entityId) return;
    
    setIsLoading(true);
    try {
      // Vérifier d'abord si le navigateur est en ligne
      if (!navigator.onLine) {
        setIsOffline(true);
        setIsLoading(false);
        return;
      }
      
      const [vote, counts] = await Promise.all([
        getUserVote(entityType, entityId),
        getVotesCount(entityType, entityId)
      ]);
      
      console.log(`Vote actuel pour ${entityType} ${entityId}:`, vote);
      console.log(`Compteurs de votes pour ${entityType} ${entityId}:`, counts);
      
      setUserVote(vote);
      setVotesCount(counts);
      setIsOffline(false);
    } catch (error) {
      console.error('Erreur lors du chargement des votes:', error);
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId]);

  const submitVoteHandler = useCallback(async (vote: VoteType) => {
    if (!entityId || isLoading) return;
    
    console.log(`Soumission du vote ${vote} pour ${entityType} ${entityId}`);
    setIsLoading(true);
    
    try {
      // Vérifier si le navigateur est en ligne
      if (!navigator.onLine) {
        setIsOffline(true);
        toast({
          title: "Erreur de connexion",
          description: "Impossible de voter sans connexion internet",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      // Optimistic update
      setUserVote(vote);
      
      // Mettre à jour le compteur de votes de manière optimiste
      setVotesCount(prev => {
        const newCounts = { ...prev };
        
        // Si l'utilisateur avait déjà voté, décrémenter l'ancien vote
        if (userVote) {
          newCounts[userVote] = Math.max(0, newCounts[userVote] - 1);
        }
        
        // Incrémenter le nouveau vote
        newCounts[vote] = (newCounts[vote] || 0) + 1;
        
        return newCounts;
      });
      
      // Effectuer le vote
      await apiSubmitVote(entityType, entityId, vote);
      
      // Si tout s'est bien passé, mettre à jour l'état
      console.log(`Vote ${vote} soumis avec succès pour ${entityType} ${entityId}`);
      
      // Rafraîchir le compteur
      const counts = await getVotesCount(entityType, entityId);
      setVotesCount(counts);
      
      // Appeler le callback en cas de succès
      if (options?.onVoteSuccess) {
        options.onVoteSuccess(vote);
      }
      
      // Notification de succès
      toast({
        title: "Vote enregistré",
        description: vote === 'up' ? 'Vous avez aimé cet ensemble' : 'Vous n\'avez pas aimé cet ensemble',
        variant: "default"
      });
      
      setIsOffline(false);
    } catch (error) {
      console.error('Erreur lors du vote:', error);
      
      // Annuler les mises à jour optimistes
      loadVoteData();
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
      
      setIsOffline(true);
    } finally {
      setIsLoading(false);
    }
  }, [entityType, entityId, userVote, isLoading, options, loadVoteData, toast]);

  // Charger les données au montage et configurer les gestionnaires d'événements réseau
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      loadVoteData();
    };
    
    const handleOffline = () => {
      setIsOffline(true);
    };
    
    // Configurer les gestionnaires d'événements
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Charger les données initiales
    loadVoteData();
    
    // Nettoyer les gestionnaires d'événements à la destruction
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadVoteData]);

  return {
    userVote,
    votesCount,
    submitVote: submitVoteHandler,
    isLoading,
    isOffline,
    loadVoteData
  };
};
