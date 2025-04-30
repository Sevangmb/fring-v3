
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMarques } from "@/services/marqueService";
import { getVetementById } from "@/services/vetement";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { Vetement } from "@/services/vetement/types";

export const useModifierVetement = (vetementId: number) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [vetement, setVetement] = useState<VetementFormValues | null>(null);
  const [marques, setMarques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (authLoading) return;
      if (!user) {
        navigate("/login");
        return;
      }

      if (!vetementId) {
        setError("Identifiant de vêtement invalide");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Charger le vêtement et les marques en parallèle
        const [vetementData, marquesData] = await Promise.all([
          getVetementById(vetementId),
          fetchMarques()
        ]);
        
        // Vérifier que le vêtement appartient à l'utilisateur
        if (vetementData.user_id !== user.id) {
          setError("Vous n'êtes pas autorisé à modifier ce vêtement");
          setIsLoading(false);
          return;
        }
        
        console.log("Vêtement chargé:", vetementData);
        
        // Adapter le vêtement au format du formulaire
        const adaptedVetement: VetementFormValues = {
          nom: vetementData.nom,
          description: vetementData.description || '',
          categorie_id: vetementData.categorie_id,
          couleur: vetementData.couleur,
          taille: vetementData.taille,
          marque: vetementData.marque || '',
          image_url: vetementData.image_url || '',
          temperature: vetementData.temperature as any,
          weather_type: vetementData.weather_type as any,
          a_vendre: vetementData.a_vendre,
          prix_achat: vetementData.prix_achat,
          prix_vente: vetementData.prix_vente,
          promo_pourcentage: vetementData.promo_pourcentage,
          etat: vetementData.etat as any,
          disponibilite: vetementData.disponibilite as any,
          lieu_vente: vetementData.lieu_vente || '',
          infos_vente: vetementData.infos_vente || '',
        };
        
        setVetement(adaptedVetement);
        setMarques(marquesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Impossible de charger les données. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vetementId, user, authLoading, navigate]);

  return {
    user,
    vetement,
    marques,
    isLoading,
    error
  };
};
