
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ensemble } from "@/services/ensemble";
import { fetchEnsemblesAmis } from "@/services/ensemble";
import { useAuth } from "@/contexts/AuthContext";

export const useEnsemblesAmis = (friendId?: string) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [ensemblesAmis, setEnsemblesAmis] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEnsemblesAmis = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setError(new Error("Utilisateur non connecté"));
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      console.log("Chargement des ensembles pour l'ami:", friendId || "tous les amis");
      
      // Éviter d'appeler avec son propre ID comme friendId
      const effectiveFriendId = (friendId && friendId === user.id) ? "all" : friendId;
      
      const data = await fetchEnsemblesAmis(effectiveFriendId);
      
      setEnsemblesAmis(data);
      console.log("Ensembles des amis chargés:", data.length);
    } catch (error) {
      console.error("Erreur lors du chargement des ensembles des amis:", error);
      setError(error instanceof Error ? error : new Error("Erreur de chargement"));
      toast({
        title: "Erreur",
        description: "Impossible de charger les ensembles des amis.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast, friendId, user]);

  useEffect(() => {
    loadEnsemblesAmis();
  }, [loadEnsemblesAmis]);

  const refreshEnsemblesAmis = () => {
    loadEnsemblesAmis();
  };

  return { ensemblesAmis, loading, error, refreshEnsemblesAmis };
};
