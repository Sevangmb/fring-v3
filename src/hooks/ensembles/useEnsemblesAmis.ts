
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ensemble } from "@/services/ensemble";
import { fetchEnsemblesAmis } from "@/services/ensemble";
import { useAuth } from "@/contexts/AuthContext";
import { writeLog } from "@/services/logs";

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
      
      const effectiveFriendId = (friendId && friendId === user.id) ? undefined : friendId;
      
      let data: Ensemble[] = [];
      try {
        data = await fetchEnsemblesAmis(effectiveFriendId);
      } catch (apiError) {
        console.error("Erreur lors de l'appel à fetchEnsemblesAmis:", apiError);
        
        if (apiError && typeof apiError === 'object' && 'message' in apiError) {
          const errorMessage = apiError.message;
          
          if (errorMessage && typeof errorMessage === 'string' && 
              errorMessage.includes("n'est pas dans vos amis")) {
            
            writeLog(
              `Tentative d'accès aux ensembles d'un non-ami`, 
              'warning', 
              `Friend ID: ${friendId}`, 
              'ensembles'
            );
            
            toast({
              title: "Attention",
              description: "Cet utilisateur n'est pas dans vos amis ou la demande n'est pas acceptée.",
              variant: "default"
            });
            
            setEnsemblesAmis([]);
            setLoading(false);
            return;
          }
        }
        
        throw apiError;
      }
      
      setEnsemblesAmis(data);
      console.log("Ensembles des amis chargés:", data.length);
    } catch (error) {
      console.error("Erreur lors du chargement des ensembles des amis:", error);
      
      writeLog(
        "Erreur lors du chargement des ensembles des amis", 
        'error', 
        error instanceof Error ? error.message : 'Erreur inconnue', 
        'ensembles'
      );
      
      setError(error instanceof Error ? error : new Error("Impossible de charger les ensembles. Veuillez réessayer plus tard."));
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
