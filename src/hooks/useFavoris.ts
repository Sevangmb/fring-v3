
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  addFavori, 
  removeFavori, 
  isFavori,
  getFavorisWithDetails,
  FavoriWithDetails
} from '@/services/favoris';

export const useFavoris = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favoris, setFavoris] = useState<FavoriWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger tous les favoris
  const loadFavoris = useCallback(async () => {
    if (!user) {
      setFavoris([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getFavorisWithDetails();
      setFavoris(data);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Vérifier si un élément est en favori
  const checkFavori = useCallback(async (
    type: 'utilisateur' | 'vetement' | 'ensemble',
    elementId: string | number
  ) => {
    if (!user) return false;
    return await isFavori(type, elementId);
  }, [user]);

  // Ajouter aux favoris
  const ajouterFavori = useCallback(async (
    type: 'utilisateur' | 'vetement' | 'ensemble',
    elementId: string | number,
    nom?: string
  ) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Veuillez vous connecter pour ajouter aux favoris.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const success = await addFavori(type, elementId);
      if (success) {
        // Rafraîchir la liste
        loadFavoris();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter aux favoris.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, loadFavoris]);

  // Retirer des favoris
  const retirerFavori = useCallback(async (
    type: 'utilisateur' | 'vetement' | 'ensemble',
    elementId: string | number,
    nom?: string
  ) => {
    if (!user) return false;

    try {
      const success = await removeFavori(type, elementId);
      if (success) {
        // Rafraîchir la liste
        loadFavoris();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors du retrait des favoris:", error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer des favoris.",
        variant: "destructive",
      });
      return false;
    }
  }, [user, toast, loadFavoris]);

  // Basculer l'état de favori
  const toggleFavori = useCallback(async (
    type: 'utilisateur' | 'vetement' | 'ensemble',
    elementId: string | number,
    isFavoriActuel: boolean,
    nom?: string
  ) => {
    if (isFavoriActuel) {
      return await retirerFavori(type, elementId, nom);
    } else {
      return await ajouterFavori(type, elementId, nom);
    }
  }, [ajouterFavori, retirerFavori]);

  // Charger les favoris au chargement et quand l'utilisateur change
  useEffect(() => {
    loadFavoris();
  }, [loadFavoris]);

  return {
    favoris,
    loading,
    checkFavori,
    ajouterFavori,
    retirerFavori,
    toggleFavori,
    loadFavoris
  };
};
