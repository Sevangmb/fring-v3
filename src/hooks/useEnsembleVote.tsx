
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { VoteType, EntityType } from "@/services/votes/types";
import { getUserVote } from "@/services/votes/getUserVote";
import { submitVote } from "@/services/votes/submitVote";
import { getVotesCount } from "@/services/votes/getVotesCount";
import { fetchEnsembleById } from "@/services/ensemble";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";

interface UseEnsembleVoteProps {
  ensembleId: number;
  defiId?: number;
  onVoteSuccess?: (vote: VoteType) => void;
}

export const useEnsembleVote = ({ 
  ensembleId,
  defiId = 0,
  onVoteSuccess
}: UseEnsembleVoteProps) => {
  const { toast } = useToast();
  
  // État local
  const [ensemble, setEnsemble] = useState<any>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({});
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [votesCount, setVotesCount] = useState<{ up: number; down: number }>({ up: 0, down: 0 });
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  
  // Vérifier l'état de la connexion
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
  
  // Charger les données de l'ensemble
  const loadEnsemble = useCallback(async () => {
    if (!ensembleId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Loading ensemble data for ID: ${ensembleId}`);
      const ensembleData = await fetchEnsembleById(ensembleId);
      
      if (!ensembleData) {
        console.error(`No ensemble found with ID: ${ensembleId}`);
        setError("Impossible de charger l'ensemble");
        return;
      }
      
      console.log("Ensemble data loaded successfully:", ensembleData);
      setEnsemble(ensembleData);
      
      // Organiser les vêtements par type
      const vetements = ensembleData?.vetements || [];
      console.log("Organizing vetements:", vetements);
      const organizedVetements = organizeVetementsByType(vetements);
      console.log("Organized vetements by type:", organizedVetements);
      setVetementsByType(organizedVetements);
    } catch (err) {
      console.error("Erreur lors du chargement de l'ensemble:", err);
      setError("Erreur lors du chargement de l'ensemble");
    } finally {
      setLoading(false);
    }
  }, [ensembleId]);
  
  // Charger les votes
  const loadVoteData = useCallback(async () => {
    if (!ensembleId || isOffline) return;
    
    try {
      // Récupérer le vote de l'utilisateur
      const vote = await getUserVote('ensemble', ensembleId);
      setUserVote(vote);
      
      // Récupérer le décompte des votes
      const votes = await getVotesCount('ensemble', ensembleId);
      setVotesCount(votes);
    } catch (err) {
      console.error("Erreur lors du chargement des votes:", err);
    }
  }, [ensembleId, isOffline]);
  
  // Charger les données initiales
  useEffect(() => {
    loadEnsemble();
    loadVoteData();
  }, [loadEnsemble, loadVoteData]);
  
  // Gérer le vote
  const handleVote = useCallback(async (vote: VoteType) => {
    if (isVoting || isOffline) return;
    
    setIsVoting(true);
    console.log(`Submitting vote ${vote} for ensemble ${ensembleId}`);
    
    try {
      // Soumettre le vote
      if (defiId) {
        // Si c'est un vote dans le cadre d'un défi
        console.log(`Voting for ensemble ${ensembleId} in defi ${defiId}`);
        // Fix: convert defiId from number to 'defi' EntityType and pass ensembleId as third parameter
        await submitVote('defi', defiId, vote, ensembleId);
      } else {
        // Vote pour un ensemble hors défi
        console.log(`Voting for standalone ensemble ${ensembleId}`);
        await submitVote('ensemble', ensembleId, vote);
      }
      
      // Mettre à jour l'état local
      setUserVote(vote);
      setHasVoted(true);
      
      // Mettre à jour le comptage des votes
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
      if (onVoteSuccess) {
        onVoteSuccess(vote);
      }
      
      toast({
        title: "Vote enregistré !",
        description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      console.log("Vote submitted successfully");
    } catch (err) {
      console.error("Erreur lors du vote:", err);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  }, [isVoting, isOffline, defiId, ensembleId, userVote, onVoteSuccess, toast]);
  
  return {
    ensemble,
    vetementsByType,
    userVote,
    votesCount,
    loading,
    isVoting,
    isOffline,
    error,
    hasVoted,
    setHasVoted,
    handleVote,
    loadVoteData,
    loadEnsemble
  };
};
