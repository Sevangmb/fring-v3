
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVote, VoteType, EntityType } from "./useVote";

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
  const { 
    submitVote, 
    getUserVote, 
    getVotesCount, 
    calculateScore, 
    isLoading: voteLoading,
    isOffline
  } = useVote(entityType);
  
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votes, setVotes] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  // Charger les données initiales des votes
  const loadVoteData = useCallback(async () => {
    if (!entityId) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      // Vérifier d'abord la connexion
      if (!navigator.onLine) {
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
    if (entityId) {
      loadVoteData();
    } else {
      setLoading(false); // No loading if no entityId
    }
    
    // Ajouter un écouteur d'événements pour détecter les changements de connectivité
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        // Recharger les données lorsque la connexion est rétablie
        setConnectionError(false);
        if (entityId) {
          loadVoteData();
        }
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
  }, [entityId, loadVoteData]);
  
  // Gérer la soumission de vote
  const handleVote = async (vote: VoteType): Promise<boolean> => {
    if (!entityId) {
      toast({
        title: "Erreur",
        description: "Impossible de voter: ID de l'élément manquant.",
        variant: "destructive"
      });
      return false;
    }
    
    // Vérifier si déjà en cours de soumission
    if (isSubmitting || loading) return false;
    
    // Vérifier la connexion
    if (!navigator.onLine || connectionError || isOffline) {
      toast({
        title: "Problème de connexion",
        description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
        variant: "destructive"
      });
      return false;
    }
    
    setIsSubmitting(true);
    
    try {
      // Mise à jour optimiste
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
      
      // Mettre à jour l'état local immédiatement (optimiste)
      setUserVote(vote);
      setVotes(newVotes);
      
      // Envoyer le vote au serveur
      const success = await submitVote(entityId, vote);
      
      if (success) {
        // Appeler le callback si fourni
        if (onVoteSubmitted) {
          onVoteSubmitted(vote);
        }
        return true;
      } else {
        // En cas d'échec, revenir à l'état précédent
        setUserVote(oldVote);
        setVotes(votes);
        return false;
      }
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
    connectionError: connectionError || isOffline,
    handleVote,
    refresh: loadVoteData
  };
};
