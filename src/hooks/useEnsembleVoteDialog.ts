
import { useState, useEffect } from "react";
import { VetementType } from "@/services/meteo/tenue";
import { fetchEnsembleById } from "@/services/ensemble/fetchEnsembleById";
import { organizeVetementsByType } from "@/components/defis/voting/helpers/vetementOrganizer";
import { useToast } from "@/hooks/use-toast";
import { useEntityVote } from "@/hooks/useEntityVote";

interface UseEnsembleVoteDialogProps {
  ensembleId: number;
  onClose: () => void;
}

export const useEnsembleVoteDialog = ({ 
  ensembleId,
  onClose
}: UseEnsembleVoteDialogProps) => {
  const { toast } = useToast();
  const [ensemble, setEnsemble] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vetementsByType, setVetementsByType] = useState<Record<string, any[]>>({
    [VetementType.HAUT]: [],
    [VetementType.BAS]: [],
    [VetementType.CHAUSSURES]: [],
    'autre': []
  });

  const { userVote, votes, handleVote, isSubmitting, connectionError } = useEntityVote({
    entityType: "defi",
    entityId: ensembleId,
  });

  const resetState = () => {
    setError(null);
    setEnsemble(null);
    setVetementsByType({
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    });
  };

  const loadEnsemble = async () => {
    if (!ensembleId) return;
    
    setLoading(true);
    setError(null);
    try {
      if (!navigator.onLine) {
        throw new Error("Pas de connexion internet");
      }
      
      const ensembleData = await fetchEnsembleById(ensembleId);
      
      if (!ensembleData) {
        throw new Error("Impossible de charger l'ensemble");
      }
      
      setEnsemble(ensembleData);
      
      if (ensembleData && ensembleData.vetements) {
        const organizedVetements = organizeVetementsByType(ensembleData);
        setVetementsByType(organizedVetements);
      } else {
        setError("Aucun vêtement trouvé pour cet ensemble");
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'ensemble:", error);
      if (!navigator.onLine) {
        setError("Pas de connexion internet");
      } else {
        setError("Erreur lors du chargement de l'ensemble");
      }
    } finally {
      setLoading(false);
    }
  };

  const onVote = async (vote: 'up' | 'down') => {
    if (!navigator.onLine || connectionError) {
      toast({
        title: "Erreur",
        description: "Pas de connexion internet. Veuillez vérifier votre connexion et réessayer.",
        variant: "destructive",
      });
      return false;
    }
    
    const success = await handleVote(vote);
    
    if (success) {
      toast({
        title: "Vote enregistré",
        description: vote === 'up' ? "Vous aimez cet ensemble" : "Vous n'aimez pas cet ensemble",
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      setTimeout(() => {
        onClose();
      }, 500);
    } else {
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive",
      });
    }
    
    return success;
  };

  useEffect(() => {
    // Gestionnaire d'événements pour les changements de connexion
    const handleOnlineStatusChange = () => {
      if (navigator.onLine && ensemble === null) {
        loadEnsemble();
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
    };
  }, [ensemble]);

  return {
    ensemble,
    loading,
    error,
    vetementsByType,
    userVote,
    votes,
    isSubmitting,
    connectionError,
    resetState,
    loadEnsemble,
    onVote
  };
};
