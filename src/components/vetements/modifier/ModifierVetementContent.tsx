
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Loader2, FileText, Info, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import VetementFormContainer from "@/components/vetements/VetementFormContainer";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
        weatherType: formData.weatherType || null
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
      
      navigate("/mes-vetements/liste");
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Chargement des données...</span>
      </div>
    );
  }

  if (!vetement) {
    return null;
  }

  return (
    <Tabs defaultValue="principal" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="principal" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Informations principales
        </TabsTrigger>
        <TabsTrigger value="supplementaire" className="flex items-center gap-2">
          <Info className="h-4 w-4" />
          Informations supplémentaires
        </TabsTrigger>
        <TabsTrigger value="etiquette" className="flex items-center gap-2">
          <Tag className="h-4 w-4" />
          Étiquette
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="principal">
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
      </TabsContent>
      
      <TabsContent value="supplementaire">
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
      </TabsContent>
      
      <TabsContent value="etiquette">
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
      </TabsContent>
    </Tabs>
  );
};

export default ModifierVetementContent;
