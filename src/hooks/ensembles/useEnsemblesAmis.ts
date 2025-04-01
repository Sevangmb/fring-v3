
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Ensemble } from "@/services/ensemble";
import { fetchEnsemblesAmis } from "@/services/ensemble";

export const useEnsemblesAmis = (friendId?: string) => {
  const { toast } = useToast();
  const [ensemblesAmis, setEnsemblesAmis] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEnsemblesAmis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Chargement des ensembles pour l'ami:", friendId || "tous les amis");
      const data = await fetchEnsemblesAmis(friendId);
      
      if (Array.isArray(data)) {
        // Transformation des données pour assurer la compatibilité
        const formattedEnsembles = data.map(ensemble => {
          // Vérifier si les vêtements sont un tableau ou une chaîne à parser
          let vetements = ensemble.vetements;
          if (typeof vetements === 'string') {
            try {
              vetements = JSON.parse(vetements);
            } catch (e) {
              console.error("Erreur lors du parsing des vêtements:", e);
              vetements = [];
            }
          }
          
          // Si vetements n'est toujours pas un tableau, le convertir en tableau vide
          if (!Array.isArray(vetements)) {
            vetements = [];
          }
          
          return {
            ...ensemble,
            vetements,
            // S'assurer que l'email est correctement passé
            email: ensemble.email || undefined
          };
        });
        
        setEnsemblesAmis(formattedEnsembles);
        console.log("Ensembles des amis chargés:", formattedEnsembles.length);
      } else {
        console.error("Format de données inattendu:", data);
        setError(new Error("Format de données inattendu"));
      }
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
