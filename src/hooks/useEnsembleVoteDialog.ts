
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

  const { userVote, votes, handleVote } = useEntityVote({
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
      setError("Erreur lors du chargement de l'ensemble");
    } finally {
      setLoading(false);
    }
  };

  const onVote = async (vote: 'up' | 'down') => {
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
  };

  return {
    ensemble,
    loading,
    error,
    vetementsByType,
    userVote,
    resetState,
    loadEnsemble,
    onVote
  };
};
