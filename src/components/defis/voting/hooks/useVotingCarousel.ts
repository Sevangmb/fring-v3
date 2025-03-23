
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDefiParticipationsWithVotes, submitVote, getUserVote } from "@/services/defi/voteService";
import { fetchDefiById } from "@/services/defi";

export const useVotingCarousel = (defiId: number) => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [votingState, setVotingState] = useState<Record<number, 'up' | 'down' | null>>({});
  const [defi, setDefi] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger le défi
        const defiData = await fetchDefiById(defiId);
        if (defiData) {
          setDefi(defiData);
        }
        
        // Charger les participations avec les votes
        const data = await getDefiParticipationsWithVotes(defiId);
        setParticipations(data);
        
        // Initialiser l'état des votes de l'utilisateur
        const userVotes: Record<number, 'up' | 'down' | null> = {};
        for (const participation of data) {
          const userVote = await getUserVote(defiId, participation.ensemble_id);
          userVotes[participation.ensemble_id] = userVote;
        }
        setVotingState(userVotes);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les participations du défi",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [defiId, toast]);

  const handleVote = async (ensembleId: number, vote: 'up' | 'down') => {
    try {
      const success = await submitVote(defiId, ensembleId, vote);
      
      if (success) {
        // Mettre à jour l'état local des votes
        setVotingState(prev => ({
          ...prev,
          [ensembleId]: vote
        }));
        
        // Mettre à jour les compteurs de votes
        setParticipations(prev => 
          prev.map(p => {
            if (p.ensemble_id === ensembleId) {
              const oldVote = votingState[ensembleId];
              const votes = { ...p.votes };
              
              // Si l'utilisateur change son vote
              if (oldVote) {
                if (oldVote === 'up') votes.up = Math.max(0, votes.up - 1);
                if (oldVote === 'down') votes.down = Math.max(0, votes.down - 1);
              }
              
              // Ajouter le nouveau vote
              if (vote === 'up') votes.up += 1;
              if (vote === 'down') votes.down += 1;
              
              // Recalculer le score
              const score = votes.up - votes.down;
              
              return { ...p, votes, score };
            }
            return p;
          })
        );
        
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    }
  };

  const navigatePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const navigateNext = () => {
    setCurrentIndex(prev => (prev < participations.length - 1 ? prev + 1 : prev));
  };

  return {
    defi,
    participations,
    currentIndex,
    loading,
    votingState,
    handleVote,
    navigatePrevious,
    navigateNext
  };
};
