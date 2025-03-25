
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVote } from "@/hooks/useVote";

interface UseEnsembleVoteProps {
  ensembleId: number;
  onVoteSuccess?: () => void;
}

export function useEnsembleVote({ ensembleId, onVoteSuccess }: UseEnsembleVoteProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ensemble, setEnsemble] = useState<any>(null);
  const [vetementsByType, setVetementsByType] = useState<any>({});
  const [hasVoted, setHasVoted] = useState(false);
  const { toast } = useToast();
  
  // Utilisation du hook useVote spécifiquement pour l'ensemble
  const {
    submitVote,
    userVote,
    votesCount,
    isLoading: isVoting,
    isOffline,
    loadVoteData
  } = useVote('ensemble', ensembleId, {
    onVoteSuccess: (vote) => {
      console.log(`Vote ${vote} soumis avec succès pour l'ensemble ${ensembleId}`);
      // Ne pas fermer le dialogue, mais passer à l'état "voté"
      setHasVoted(true);
      toast({
        title: "Vote enregistré!",
        description: `Votre ${vote === 'up' ? 'vote positif' : 'vote négatif'} a été enregistré.`,
        variant: vote === 'up' ? "default" : "destructive",
      });
      
      if (onVoteSuccess) {
        onVoteSuccess();
      }
    }
  });
  
  // Chargement des données de l'ensemble
  const loadEnsemble = useCallback(async () => {
    if (!ensembleId || isNaN(ensembleId) || ensembleId <= 0) {
      console.error(`ID d'ensemble invalide: ${ensembleId}`);
      setError("Aucun ensemble disponible pour ce participant");
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { supabase } = await import('@/lib/supabase');
      
      console.log(`Chargement de l'ensemble ${ensembleId}`);
      
      // D'abord, vérifions si cet ensembleId existe réellement
      const { data: ensembleExists, error: checkError } = await supabase
        .from('tenues')
        .select('id')
        .eq('id', ensembleId)
        .maybeSingle();
        
      if (checkError) {
        console.error("Erreur lors de la vérification de l'ensemble:", checkError);
        throw checkError;
      }
      
      if (!ensembleExists) {
        console.error(`L'ensemble ${ensembleId} n'existe pas`);
        setError("L'ensemble n'a pas pu être chargé ou n'existe pas.");
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('tenues')
        .select(`
          id, 
          nom, 
          description, 
          occasion, 
          saison, 
          created_at, 
          user_id,
          vetements:tenues_vetements(
            id,
            vetement:vetement_id(*),
            position_ordre
          )
        `)
        .eq('id', ensembleId)
        .maybeSingle();
      
      if (error) {
        console.error("Erreur lors du chargement de l'ensemble:", error);
        throw error;
      }
      
      if (!data) {
        console.error(`Aucun ensemble trouvé avec l'ID ${ensembleId}`);
        setError("L'ensemble n'a pas pu être chargé ou n'existe pas.");
        setLoading(false);
        return;
      }

      console.log(`Ensemble chargé: ${JSON.stringify(data)}`);
      setEnsemble(data);
      
      // Organize vetements by type
      const byType: any = {};
      if (data?.vetements && Array.isArray(data.vetements)) {
        console.log(`Nombre de vêtements: ${data.vetements.length}`);
        data.vetements.forEach((item: any) => {
          if (item.vetement) {
            const categorie = item.vetement.categorie_id;
            if (!byType[categorie]) {
              byType[categorie] = [];
            }
            byType[categorie].push(item.vetement);
          } else {
            console.log("Item sans vêtement:", item);
          }
        });
      } else {
        console.log("Pas de vêtements ou format invalide:", data?.vetements);
      }
      
      setVetementsByType(byType);
      setError(null);
    } catch (err) {
      console.error('Error loading ensemble:', err);
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [ensembleId]);
  
  // Fonction pour soumettre un vote
  const handleVote = async (vote: 'up' | 'down') => {
    console.log(`Tentative de vote ${vote} pour l'ensemble ${ensembleId}`);
    try {
      await submitVote(vote);
      // Le vote est traité dans le callback onVoteSuccess du hook useVote
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    }
  };
  
  return {
    ensemble,
    loading,
    error,
    vetementsByType,
    hasVoted,
    setHasVoted,
    handleVote,
    userVote,
    votesCount,
    isVoting,
    isOffline,
    loadVoteData,
    loadEnsemble
  };
}
