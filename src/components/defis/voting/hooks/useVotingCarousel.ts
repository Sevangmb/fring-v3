
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getDefiParticipationsWithVotes, submitVote, getUserVote } from "@/services/defi/voteService";
import { fetchDefiById } from "@/services/defi";
import { supabase } from "@/lib/supabase";

// Fonction utilitaire pour les retries de requêtes
const fetchWithRetry = async (
  fetchFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      console.log(`Tentative ${attempt + 1}/${maxRetries} échouée:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Attendre avant de réessayer avec un délai exponentiel
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
};

export const useVotingCarousel = (defiId: number) => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [votingState, setVotingState] = useState<Record<number, 'up' | 'down' | null>>({});
  const [defi, setDefi] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérifier la connexion à Supabase
  const checkConnection = async (): Promise<boolean> => {
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
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Vérifier d'abord la connexion
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
        
        // Charger le défi
        const defiData = await fetchWithRetry(
          () => fetchDefiById(defiId),
          3
        );
        
        if (defiData) {
          setDefi(defiData);
        }
        
        // Charger les participations avec les votes
        const data = await fetchWithRetry(
          () => getDefiParticipationsWithVotes(defiId),
          3
        );
        
        setParticipations(data);
        
        // Initialiser l'état des votes de l'utilisateur
        const userVotes: Record<number, 'up' | 'down' | null> = {};
        for (const participation of data) {
          const userVote = await fetchWithRetry(
            () => getUserVote(defiId, participation.ensemble_id),
            3
          );
          
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
    // Vérifier si déjà en train de voter
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Vérifier d'abord la connexion
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        return;
      }
      
      const success = await fetchWithRetry(
        () => submitVote(defiId, ensembleId, vote),
        3
      );
      
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
    } finally {
      setIsSubmitting(false);
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
    isSubmitting,
    handleVote,
    navigatePrevious,
    navigateNext
  };
};
