
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { isFavori } from '@/services/favoris';
import { useFavoris } from './useFavoris';

export const useElementFavori = (
  type: 'utilisateur' | 'vetement' | 'ensemble',
  elementId: string | number,
  nom?: string
) => {
  const { user } = useAuth();
  const [estFavori, setEstFavori] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { ajouterFavori, retirerFavori } = useFavoris();

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
  const toggleFavori = useCallback(async () => {
    if (!user) return;

    try {
      if (estFavori) {
        const success = await retirerFavori(type, elementId, nom);
        if (success) setEstFavori(false);
      } else {
        const success = await ajouterFavori(type, elementId, nom);
        if (success) setEstFavori(true);
      }
    } catch (error) {
      console.error("Erreur lors du basculement du favori:", error);
    }
  }, [user, estFavori, type, elementId, nom, ajouterFavori, retirerFavori]);

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
