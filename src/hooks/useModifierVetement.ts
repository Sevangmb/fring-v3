
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchMarques } from "@/services/marqueService";
import { getVetementById } from "@/services/vetement";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";

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
        setVetement(vetementData);
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
