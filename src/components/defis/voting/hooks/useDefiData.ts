import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchDefiById, getDefiParticipationsWithVotes, getUserVote } from "@/services/defi/voteService";
import { fetchWithRetry, checkConnection } from "../utils/networkUtils";

export const useDefiData = (defiId: number) => {
  const { toast } = useToast();
  const [defi, setDefi] = useState<any>(null);
  const [participations, setParticipations] = useState<any[]>([]);
  const [votingState, setVotingState] = useState<Record<number, 'up' | 'down' | null>>({});
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const loadDefiData = async () => {
    setLoading(true);
    try {
      // First check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        toast({
          title: "Problème de connexion",
          description: "Impossible de se connecter au serveur. Vérifiez votre connexion internet.",
          variant: "destructive"
        });
        setConnectionError(true);
        setLoading(false);
        return;
      }
      
      // Load defi data
      const defiData = await fetchWithRetry(
        async () => await fetchDefiById(defiId),
        3
      );
      
      if (defiData) {
        setDefi(defiData);
      }
      
      // Load participations with votes
      const data = await fetchWithRetry(
        async () => await getDefiParticipationsWithVotes(defiId),
        3
      );
      
      setParticipations(data);
      
      // Initialize user votes state
      const userVotes: Record<number, 'up' | 'down' | null> = {};
      for (const participation of data) {
        const userVote = await fetchWithRetry(
          async () => await getUserVote(defiId, participation.ensemble_id),
          3
        );
        
        userVotes[participation.ensemble_id] = userVote;
      }
      setVotingState(userVotes);
      
      setConnectionError(false);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les participations du défi",
        variant: "destructive"
      });
      setConnectionError(true);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDefiData();
    
    // Setup network status change listeners
    const handleOnlineStatusChange = () => {
      if (navigator.onLine) {
        setConnectionError(false);
        loadDefiData();
      } else {
        setConnectionError(true);
      }
    };
    
    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, [defiId]);

  return {
    defi,
    participations,
    votingState,
    loading,
    connectionError,
    setParticipations,
    setVotingState,
    loadDefiData
  };
};
