
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";

export function useVotingDialog(defiId?: number) {
  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Charger les ensembles pour un défi spécifique
  const loadEnsembles = useCallback(async () => {
    if (!defiId) return;

    setLoading(true);
    setError(null);

    try {
      // Récupérer les participations du défi
      const { data: participations, error: participationsError } = await supabase
        .from('defi_participations')
        .select(`
          id,
          ensemble_id,
          user_id,
          tenue:ensemble_id(
            id,
            nom,
            description,
            occasion,
            saison,
            created_at,
            user_id,
            vetements:tenues_vetements(
              id,
              vetement:vetement_id(*)
            )
          )
        `)
        .eq('defi_id', defiId)
        .order('created_at', { ascending: false });

      if (participationsError) throw participationsError;

      // Transformer les données pour avoir une structure plus simple
      const formattedEnsembles = participations.map(p => ({
        id: p.ensemble_id,
        ...p.tenue,
      })).filter(e => e !== null);

      setEnsembles(formattedEnsembles);
    } catch (err) {
      console.error("Erreur lors du chargement des ensembles:", err);
      setError(err instanceof Error ? err : new Error('Erreur de chargement'));
      
      toast({
        title: "Erreur",
        description: "Impossible de charger les ensembles. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [defiId, toast]);

  // Charger les ensembles lorsque le defiId change
  useEffect(() => {
    if (defiId) {
      loadEnsembles();
    }
  }, [defiId, loadEnsembles]);

  // Gérer le vote
  const handleVoteSubmitted = useCallback((ensembleId: number, vote: VoteType) => {
    console.log(`Vote ${vote} soumis pour l'ensemble ${ensembleId}`);
    // Vous pourriez vouloir faire quelque chose après un vote réussi, comme mettre à jour une liste
  }, []);

  // Ouvrir le dialogue
  const openDialog = useCallback(() => {
    if (ensembles.length === 0) {
      toast({
        title: "Aucun ensemble",
        description: "Il n'y a pas d'ensembles disponibles pour voter.",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  }, [ensembles.length, toast]);

  return {
    ensembles,
    loading,
    error,
    open,
    setOpen,
    openDialog,
    handleVoteSubmitted,
    refresh: loadEnsembles
  };
}
