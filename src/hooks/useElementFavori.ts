
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isFavori } from '@/services/favoris';
import { useFavoris } from './useFavoris';
import { useToast } from '@/hooks/use-toast';

export const useElementFavori = (
  type: 'utilisateur' | 'vetement' | 'ensemble',
  elementId: string | number,
  nom?: string
) => {
  const { user } = useAuth();
  const [estFavori, setEstFavori] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { ajouterFavori, retirerFavori } = useFavoris();
  const { toast } = useToast();

  // Vérifier si l'élément est dans les favoris
  const verifierFavori = useCallback(async () => {
    if (!user) {
      setEstFavori(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const resultat = await isFavori(type, elementId);
      setEstFavori(resultat);
    } catch (error) {
      console.error("Erreur lors de la vérification du favori:", error);
      setEstFavori(false);
    } finally {
      setLoading(false);
    }
  }, [user, type, elementId]);

  // Basculer l'état de favori
  const toggleFavori = useCallback(async (): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour ajouter des favoris.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      
      let success: boolean;
      if (estFavori) {
        success = await retirerFavori(type, elementId, nom);
        if (success) setEstFavori(false);
      } else {
        success = await ajouterFavori(type, elementId, nom);
        if (success) setEstFavori(true);
      }
      
      return success;
    } catch (error) {
      console.error("Erreur lors du basculement du favori:", error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, estFavori, type, elementId, nom, ajouterFavori, retirerFavori, toast]);

  // Vérifier l'état initial
  useEffect(() => {
    verifierFavori();
  }, [verifierFavori]);

  return {
    estFavori,
    loading,
    toggleFavori
  };
};
