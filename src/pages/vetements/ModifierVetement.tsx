
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCategories } from "@/services/categorieService";
import { fetchMarques } from "@/services/marqueService";
import { getVetementById, updateVetement } from "@/services/vetement";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import VetementFormContainer from "@/components/vetements/VetementFormContainer";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";

const ModifierVetementPage = () => {
  const { id } = useParams<{ id: string }>();
  const vetementId = parseInt(id || "0");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [vetement, setVetement] = useState<VetementFormValues | null>(null);
  const [categories, setCategories] = useState([]);
  const [marques, setMarques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données nécessaires
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
        
        // Charger le vêtement, les catégories et les marques en parallèle
        const [vetementData, categoriesData, marquesData] = await Promise.all([
          getVetementById(vetementId),
          fetchCategories(),
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
        setCategories(categoriesData);
        setMarques(marquesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        setError("Impossible de charger les données. Veuillez réessayer.");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données du vêtement.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [vetementId, user, authLoading, navigate, toast]);

  // NOUVELLE IMPLÉMENTATION: Fonction de mise à jour directe
  const handleUpdate = async (updatedData: VetementFormValues) => {
    try {
      setIsLoading(true);
      console.log("====== DÉBUT SOUMISSION DU FORMULAIRE ======");
      console.log("Données du formulaire:", updatedData);
      
      if (!vetementId) {
        throw new Error("ID de vêtement manquant");
      }
      
      // Collecte directe des données sans transformation
      const dataToUpdate = {
        nom: updatedData.nom,
        categorie: updatedData.categorie,
        couleur: updatedData.couleur,
        taille: updatedData.taille,
        description: updatedData.description || null,
        marque: updatedData.marque || null,
        image_url: updatedData.image_url || null
      };
      
      console.log("Données envoyées au service:", dataToUpdate);
      
      // Appel direct au service de mise à jour
      await updateVetement(vetementId, dataToUpdate);
      
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
        description: "Impossible de mettre à jour le vêtement.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/mes-vetements/liste")}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading>Modifier un vêtement</Heading>
          </div>
          <Text className="text-muted-foreground max-w-2xl mt-4">
            Modifiez les informations de votre vêtement et enregistrez les changements.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des données...</span>
          </div>
        ) : (
          !error && vetement && (
            <VetementFormContainer
              user={user}
              categories={categories}
              marques={marques}
              loadingCategories={false}
              initialValues={vetement}
              onSubmit={handleUpdate}
              submitLabel="Enregistrer les modifications"
              submitIcon={<Save className="mr-2 h-4 w-4" />}
              mode="update"
            />
          )
        )}
      </div>
    </Layout>
  );
};

export default ModifierVetementPage;
