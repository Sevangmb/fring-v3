
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVote, VoteType, EntityType } from "./useVote";
import { checkConnection } from "@/services/network/retryUtils";

interface UseEntityVoteProps {
  entityType: EntityType;
  entityId?: number;
  onVoteSubmitted?: (vote: VoteType) => void;
}

export const useEntityVote = ({ 
  entityType, 
  entityId,
  onVoteSubmitted 
}: UseEntityVoteProps) => {
  const { toast } = useToast();
  const { submitVote, getUserVote, getVotesCount, calculateScore, isLoading: voteLoading } = useVote(entityType);
  
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votes, setVotes] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Charger les données initiales des votes
  const loadVoteData = useCallback(async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      // Vérifier d'abord la connexion
      const isConnected = navigator.onLine;
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        setConnectionError(true);
        setLoading(false);
        return;
      }
      
      // Obtenir le vote actuel de l'utilisateur
      const currentVote = await getUserVote(entityId);
      setUserVote(currentVote);
      
      // Obtenir les compteurs de votes
      const voteCounts = await getVotesCount(entityId);
      setVotes(voteCounts);
      
      setConnectionError(false);
    } catch (error) {
      console.error(`Erreur lors du chargement des votes pour ${entityType}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les votes. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, getUserVote, getVotesCount, toast]);
  
  useEffect(() => {
    loadVoteData();
    
    // Ajouter un écouteur d'événements pour détecter les changements de connectivité
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        // Recharger les données lorsque la connexion est rétablie
        setConnectionError(false);
        loadVoteData();
      } else {
        setConnectionError(true);
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [loadVoteData]);
  
  // Gérer la soumission de vote
  const handleVote = async (vote: VoteType): Promise<boolean> => {
    if (!entityId) return false;
    
    // Vérifier si déjà en cours de soumission
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      // Vérifier d'abord la connexion
      if (!navigator.onLine) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        return false;
      }
      
      const success = await submitVote(entityId, vote);
      
      if (success) {
        // Mettre à jour l'état local de manière optimiste
        setUserVote(vote);
        
        // Mettre à jour les compteurs de votes
        const oldVote = userVote;
        const newVotes = { ...votes };
        
        // Si l'utilisateur change son vote
        if (oldVote) {
          if (oldVote === 'up') newVotes.up = Math.max(0, newVotes.up - 1);
          if (oldVote === 'down') newVotes.down = Math.max(0, newVotes.down - 1);
        }
        
        // Ajouter le nouveau vote
        if (vote === 'up') newVotes.up += 1;
        if (vote === 'down') newVotes.down += 1;
        
        setVotes(newVotes);
        
        // Appeler le callback si fourni
        if (onVoteSubmitted) {
          onVoteSubmitted(vote);
        }
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Calculer le score en utilisant la fonction utilitaire de useVote
  const score = calculateScore(votes);
  
  return {
    userVote,
    votes,
    score,
    loading: loading || voteLoading,
    isSubmitting,
    connectionError,
    handleVote,
    refresh: loadVoteData
  };
};
