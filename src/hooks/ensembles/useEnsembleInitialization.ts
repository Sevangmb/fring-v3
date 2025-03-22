
import { useState, useEffect } from "react";
import { initializeEnsembleData } from "@/services/database/ensembleInitialization";

export const useEnsembleInitialization = () => {
  const [initialized, setInitialized] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        setInitializing(true);
        await initializeEnsembleData();
        setInitialized(true);
        setError(null);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        setError(error instanceof Error ? error : new Error("Erreur d'initialisation"));
      } finally {
        setInitializing(false);
      }
    };
    
    initialize();
  }, []);

  return { initialized, initializing, error };
};
