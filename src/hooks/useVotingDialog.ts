
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { VoteType } from "@/services/votes/types";
import { useToast } from "@/hooks/use-toast";

export function useVotingDialog(defiId?: number) {
  const [ensembles, setEnsembles] = useState<any[]>([]);
  const [votedEnsembles, setVotedEnsembles] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Charger les ensembles pour un défi spécifique et les votes de l'utilisateur
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
      
      // Récupérer les votes de l'utilisateur pour ce défi
      const { data: userVotes, error: votesError } = await supabase
        .from('defi_votes')
        .select('ensemble_id, vote')
        .eq('defi_id', defiId)
        .not('ensemble_id', 'is', null);
        
      if (votesError) throw votesError;
      
      // Extraire les IDs des ensembles déjà votés
      const votedIds = userVotes.map(vote => vote.ensemble_id);
      setVotedEnsembles(votedIds);
      
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
  const handleVoteSubmitted = useCallback(async (ensembleId: number, vote: VoteType) => {
    console.log(`Vote ${vote} soumis pour l'ensemble ${ensembleId}`);
    try {
      // Ajouter l'ID de l'ensemble aux ensembles votés
      setVotedEnsembles(prev => [...prev, ensembleId]);
      
      // Mettre à jour le nombre de votes pour le défi
      await supabase
        .from('defis')
        .update({ votes_count: supabase.rpc('increment', { row_id: defiId, table_name: 'defis' }) })
        .eq('id', defiId);
        
    } catch (error) {
      console.error("Erreur lors de la mise à jour des votes:", error);
    }
  }, [defiId]);

  // Ouvrir le dialogue
  const openDialog = useCallback(() => {
    // Filtrer les ensembles non votés
    const unvotedEnsembles = ensembles.filter(e => !votedEnsembles.includes(e.id));
    
    if (unvotedEnsembles.length === 0) {
      toast({
        title: "Aucun ensemble",
        description: "Vous avez déjà voté pour tous les ensembles disponibles.",
        variant: "destructive",
      });
      return;
    }
    setOpen(true);
  }, [ensembles, votedEnsembles, toast]);

  // Liste des ensembles non votés
  const unvotedEnsembles = ensembles.filter(e => !votedEnsembles.includes(e.id));

  return {
    ensembles: unvotedEnsembles, // Retourner seulement les ensembles non votés
    allEnsembles: ensembles,     // Tous les ensembles (pour information)
    votedCount: votedEnsembles.length,
    totalCount: ensembles.length,
    loading,
    error,
    open,
    setOpen,
    openDialog,
    handleVoteSubmitted,
    refresh: loadEnsembles
  };
}
