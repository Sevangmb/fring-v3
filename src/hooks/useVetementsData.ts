
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMarques } from "@/services/marqueService";
import { fetchCategories } from "@/services/categorieService";
import { fetchVetementsAmis } from "@/services/vetement/fetchVetements";

export const useVetementsData = (type = "mes-vetements", friendFilter = "") => {
  const [vetements, setVetements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();
  
  const isAuthenticated = !!user;

  // Effet de debug pour suivre les changements de friendFilter
  useEffect(() => {
    console.log("useVetementsData - friendFilter changé:", friendFilter);
  }, [friendFilter]);

  // Fonction pour charger les vêtements
  const fetchVetements = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      let query;
      
      if (type === "mes-vetements") {
        // Mes vêtements
        query = supabase
          .from("vetements")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
      } else if (type === "a-vendre") {
        // Mes vêtements à vendre
        query = supabase
          .from("vetements")
          .select("*")
          .eq("user_id", user.id)
          .eq("a_vendre", true)
          .order("created_at", { ascending: false });
      } else if (type === "vetements-amis") {
        // Pour le type vêtements-amis, utilisez la fonction fetchVetementsAmis
        console.log("Chargement des vêtements des amis avec le filtre:", friendFilter);
        
        const data = await fetchVetementsAmis(friendFilter !== "all" ? friendFilter : undefined);
        console.log("Données reçues de fetchVetementsAmis:", data?.length, "vêtements");
        if (data && data.length > 0) {
          console.log("Exemple de vêtement reçu:", {
            id: data[0].id,
            nom: data[0].nom,
            user_id: data[0].user_id,
            owner_email: data[0].owner_email
          });
        }
        setVetements(data || []);
        setIsLoading(false);
        return;
      }

      // Exécuter la requête pour les autres cas
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      setVetements(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des vêtements:", err);
      setError("Impossible de charger les vêtements. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }, [user, authLoading, type, friendFilter]);
  
  // Fonction pour charger les catégories
  const loadCategories = useCallback(async () => {
    try {
      const data = await fetchCategories();
      setCategories(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des catégories:", err);
    }
  }, []);
  
  // Fonction pour charger les marques
  const loadMarques = useCallback(async () => {
    try {
      const data = await fetchMarques();
      setMarques(data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des marques:", err);
    }
  }, []);
  
  // Exécuter une fois lors du montage du composant
  useEffect(() => {
    fetchVetements();
    loadCategories();
    loadMarques();
  }, [fetchVetements, loadCategories, loadMarques]);
  
  // Fonction pour recharger tous les vêtements
  const reloadVetements = useCallback(() => {
    console.log("Rechargement des vêtements avec le filtre:", friendFilter);
    fetchVetements();
  }, [fetchVetements, friendFilter]);
  
  // Fonction pour gérer la suppression d'un vêtement
  const handleVetementDeleted = useCallback((id: number) => {
    setVetements(prev => prev.filter(v => v.id !== id));
  }, []);
  
  return { 
    vetements, 
    categories,
    marques,
    isLoading, 
    error, 
    isAuthenticated,
    fetchVetements,
    reloadVetements,
    handleVetementDeleted
  };
};
