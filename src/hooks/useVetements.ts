
import { useState, useEffect } from 'react';
import { fetchVetements, Vetement } from '@/services/vetement';

export const useVetements = () => {
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [vetementsLoading, setVetementsLoading] = useState<boolean>(true);
  const [vetementsError, setVetementsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClothingItems = async () => {
      try {
        setVetementsLoading(true);
        setVetementsError(null);
        
        // Récupérer les vêtements de l'utilisateur
        const vetementsData = await fetchVetements();
        setVetements(vetementsData);
      } catch (err) {
        console.warn('Impossible de récupérer les vêtements:', err);
        const errorMessage = err instanceof Error ? err.message : 'Impossible de récupérer les vêtements';
        setVetementsError(errorMessage);
      } finally {
        setVetementsLoading(false);
      }
    };

    fetchClothingItems();
  }, []);

  return { vetements, vetementsLoading, vetementsError };
};
