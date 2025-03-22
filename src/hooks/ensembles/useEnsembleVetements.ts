
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Vetement } from "@/services/vetement/types";
import { fetchVetements, fetchVetementsAmis } from "@/services/vetement";

export const useEnsembleVetements = () => {
  const { toast } = useToast();
  const [allVetements, setAllVetements] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadAllVetements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load both personal and friends' clothing
        const [mesVetementsData, vetementsAmisData] = await Promise.all([
          fetchVetements(),
          fetchVetementsAmis()
        ]);
        
        // Combine the two sources
        const combinedVetements = [
          ...mesVetementsData, 
          ...vetementsAmisData
        ];
        
        setAllVetements(combinedVetements);
        console.log("Tous les vêtements chargés:", combinedVetements.length);
      } catch (error) {
        console.error("Erreur lors du chargement des vêtements:", error);
        setError(error instanceof Error ? error : new Error("Erreur de chargement"));
        toast({
          title: "Erreur",
          description: "Impossible de charger les vêtements.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadAllVetements();
  }, [toast]);

  return { allVetements, loading, error };
};
