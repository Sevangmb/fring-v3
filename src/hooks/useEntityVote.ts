
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVote, VoteType, EntityType } from "./useVote";
import { supabase } from "@/lib/supabase";

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
  const { submitVote, getUserVote, getVotesCount, isLoading: voteLoading } = useVote(entityType);
  
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votes, setVotes] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if Supabase connection is available
  const checkConnection = useCallback(async (): Promise<boolean> => {
    try {
      // Tenter une requête très simple pour vérifier la connexion
      const { data, error } = await supabase.from('health_check').select('*').limit(1);
      
      // Si la table n'existe pas, une autre approche simple
      if (error && error.code === '42P01') {
        const { data: session } = await supabase.auth.getSession();
        return !!session;
      }
      
      return !error;
    } catch (error) {
      console.error("Erreur de connexion à Supabase:", error);
      return false;
    }
  }, []);
  
  // Load initial vote data
  const loadVoteData = useCallback(async () => {
    if (!entityId) return;
    
    setLoading(true);
    try {
      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      
      // Get user's current vote
      const currentVote = await getUserVote(entityId);
      setUserVote(currentVote);
      
      // Get vote counts
      const voteCounts = await getVotesCount(entityId);
      setVotes(voteCounts);
    } catch (error) {
      console.error(`Erreur lors du chargement des votes pour ${entityType}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les votes. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, getUserVote, getVotesCount, toast, checkConnection]);
  
  useEffect(() => {
    loadVoteData();
  }, [loadVoteData]);
  
  // Handle vote submission
  const handleVote = async (vote: VoteType): Promise<boolean> => {
    if (!entityId) return false;
    
    // Check if already submitting
    if (isSubmitting) return false;
    
    setIsSubmitting(true);
    
    try {
      // Check connection first
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        return false;
      }
      
      const success = await submitVote(entityId, vote);
      
      if (success) {
        // Update local state optimistically
        setUserVote(vote);
        
        // Update vote counts
        const oldVote = userVote;
        const newVotes = { ...votes };
        
        // If user is changing their vote
        if (oldVote) {
          if (oldVote === 'up') newVotes.up = Math.max(0, newVotes.up - 1);
          if (oldVote === 'down') newVotes.down = Math.max(0, newVotes.down - 1);
        }
        
        // Add new vote
        if (vote === 'up') newVotes.up += 1;
        if (vote === 'down') newVotes.down += 1;
        
        setVotes(newVotes);
        
        // Call callback if provided
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
  
  // Calculate score
  const score = votes.up - votes.down;
  
  return {
    userVote,
    votes,
    score,
    loading: loading || voteLoading,
    isSubmitting,
    handleVote,
    refresh: loadVoteData
  };
};
