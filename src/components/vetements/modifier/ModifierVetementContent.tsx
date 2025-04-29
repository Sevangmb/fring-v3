
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import VetementFormContainer from "@/components/vetements/VetementFormContainer";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { updateVetement } from "@/services/vetement";

interface ModifierVetementContentProps {
  vetementId: number;
  user: any;
  vetement: VetementFormValues | null;
  marques: any[];
  isLoading: boolean;
  error: string | null;
}

const ModifierVetementContent: React.FC<ModifierVetementContentProps> = ({
  vetementId,
  user,
  vetement,
  marques,
  isLoading,
  error
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("principal");

  // Fonction de mise à jour
  const handleUpdate = async (formData: VetementFormValues) => {
    try {
      if (!vetementId) {
        throw new Error("ID de vêtement manquant");
      }
      
      console.log("====== DÉBUT SOUMISSION DU FORMULAIRE ======");
      console.log("Données du formulaire avant envoi:", formData);
      
      // Préparation des données pour la mise à jour
      const updateData = {
        nom: formData.nom,
        categorie_id: formData.categorie_id,
        couleur: formData.couleur,
        taille: formData.taille,
        description: formData.description || null,
        marque: formData.marque || null,
        image_url: formData.image_url || null,
        temperature: formData.temperature || null,
        weatherType: formData.weatherType || null,
        // Ajout des champs pour la vente
        a_vendre: formData.a_vendre || false,
        prix_achat: formData.prix_achat || null,
        prix_vente: formData.prix_vente || null,
        lieu_vente: formData.lieu_vente || null,
        infos_vente: formData.infos_vente || null,
        promo_pourcentage: formData.promo_pourcentage || null,
        etat: formData.etat || null,
        disponibilite: formData.disponibilite || "disponible"
      };
      
      console.log("Données préparées pour mise à jour:", updateData);
      
      // Envoyer les données au service de mise à jour
      const result = await updateVetement(vetementId, updateData);
      
      console.log("Résultat de la mise à jour:", result);
      console.log("====== FIN SOUMISSION DU FORMULAIRE ======");
      
      toast({
        title: "Vêtement mis à jour",
        description: "Les modifications ont été enregistrées avec succès.",
      });
      
      // Correction de la redirection pour éviter l'erreur 404
      navigate("/mes-vetements");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le vêtement. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading && !vetement) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-8 w-8 animate-spin text-primary border-2 border-current border-t-transparent rounded-full" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (!vetement) {
    return null;
  }

  return (
    <VetementFormContainer
      user={user}
      marques={marques}
      initialValues={vetement}
      onSubmit={handleUpdate}
      submitLabel="Enregistrer les modifications"
      submitIcon={<Save className="mr-2 h-4 w-4" />}
      mode="update"
      activeTab={activeTab}
    />
  );
};

export default ModifierVetementContent;
