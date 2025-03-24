
import { useState, useCallback } from "react";
import { submitVote } from "@/services/defi/votes";
import { fetchEnsembleById } from "@/services/ensemble";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import { useToast } from "@/hooks/use-toast";
import { VoteType } from "@/services/votes/types";
import { getUserVote } from "@/services/defi/votes";

interface UseEnsembleVoteDialogProps {
  ensembleId: number;
  onClose?: () => void;
  skip?: boolean; // Option pour ignorer le chargement de l'ensemble
}

export const useEnsembleVoteDialog = ({ 
  ensembleId, 
  onClose,
  skip = false
}: UseEnsembleVoteDialogProps) => {
  const { toast } = useToast();
  const [ensemble, setEnsemble] = useState<any>(null);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [vetementsByType, setVetementsByType] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  
  const resetState = useCallback(() => {
    setEnsemble(null);
    setUserVote(null);
    setVetementsByType({});
    setLoading(true);
    setError(null);
  }, []);
  
  const loadEnsemble = useCallback(async () => {
    // Si skip est true, ne pas charger l'ensemble
    if (skip) {
      setLoading(false);
      return;
    }
    
    if (!ensembleId || isNaN(ensembleId) || ensembleId <= 0) {
      console.error(`ID d'ensemble invalide: ${ensembleId}`);
      setError(new Error("ID d'ensemble invalide"));
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Vérifier la connexion internet
      if (!navigator.onLine) {
        setConnectionError(true);
        throw new Error("Pas de connexion internet");
      }
      
      // Charger l'ensemble
      const ensembleData = await fetchEnsembleById(ensembleId);
      
      if (!ensembleData) {
        throw new Error("Impossible de charger l'ensemble");
      }
      
      setEnsemble(ensembleData);
      
      // Organiser les vêtements par type
      const vetements = ensembleData.vetements || [];
      const organizedVetements = organizeVetementsByType(vetements);
      setVetementsByType(organizedVetements);
      
      // Charger le vote de l'utilisateur
      const vote = await getUserVote(0, ensembleId); // 0 est un ID de défi fictif, à remplacer dans l'implémentation réelle
      setUserVote(vote);
      
      setConnectionError(false);
    } catch (err) {
      console.error("Erreur lors du chargement de l'ensemble:", err);
      setError(err instanceof Error ? err : new Error("Erreur lors du chargement de l'ensemble"));
      
      if (!navigator.onLine) {
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }, [ensembleId, skip]);
  
  const onVote = useCallback(async (vote: VoteType) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Vérifier la connexion internet
      if (!navigator.onLine) {
        setConnectionError(true);
        throw new Error("Pas de connexion internet");
      }
      
      // Soumettre le vote (0 est un ID de défi fictif, à remplacer dans l'implémentation réelle)
      const success = await submitVote(0, ensembleId, vote);
      
      if (success) {
        setUserVote(vote);
        
        toast({
          title: "Vote enregistré",
          description: vote === 'up' ? "Vous avez aimé cet ensemble" : "Vous n'avez pas aimé cet ensemble",
        });
        
        if (onClose) {
          onClose();
        }
      } else {
        throw new Error("Impossible d'enregistrer le vote");
      }
    } catch (err) {
      console.error("Erreur lors du vote:", err);
      const errorMessage = err instanceof Error ? err.message : "Erreur lors du vote";
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [ensembleId, isSubmitting, onClose, toast]);
  
  return {
    ensemble,
    loading,
    error,
    vetementsByType,
    userVote,
    isSubmitting,
    connectionError,
    resetState,
    loadEnsemble,
    onVote
  };
};
