
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ensemble } from "@/services/ensembleService";
import { fetchEnsemblesAmis } from "@/services/ensembleService";

export const useEnsemblesAmis = (friendId?: string) => {
  const { toast } = useToast();
  const [ensemblesAmis, setEnsemblesAmis] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEnsemblesAmis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchEnsemblesAmis(friendId);
      
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
  }, [toast, friendId]);

  useEffect(() => {
    loadEnsemblesAmis();
  }, [loadEnsemblesAmis]);

  const refreshEnsemblesAmis = () => {
    loadEnsemblesAmis();
  };

  return { ensemblesAmis, loading, error, refreshEnsemblesAmis };
};
