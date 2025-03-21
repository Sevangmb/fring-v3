
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addVetement } from "@/services/supabaseService";
import VetementFormFields, { vetementSchema, VetementFormValues } from "./VetementFormFields";
import ImageUploader from "./ImageUploader";
import FormActions from "./FormActions";
import { useImagePreview } from "@/hooks/useImagePreview";

interface VetementFormContainerProps {
  user: any;
  categories: any[];
  marques: any[];
  loadingCategories: boolean;
}

const VetementFormContainer: React.FC<VetementFormContainerProps> = ({
  user,
  categories,
  marques,
  loadingCategories,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    imagePreview, 
    setImagePreview, 
    detectingColor, 
    setDetectingColor 
  } = useImagePreview();

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<VetementFormValues>({
    resolver: zodResolver(vetementSchema),
    defaultValues: {
      nom: "",
      categorie: "",
      couleur: "",
      taille: "",
      description: "",
      marque: "",
    },
  });

  const onSubmit = async (data: VetementFormValues) => {
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour ajouter un vêtement.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Utiliser notre service pour ajouter le vêtement (avec user_id ajouté dans le service)
      await addVetement({
        nom: data.nom,
        categorie: data.categorie,
        couleur: data.couleur,
        taille: data.taille,
        description: data.description || null,
        marque: data.marque || null,
        image_url: imagePreview || null,
      });
      
      toast({
        title: "Vêtement ajouté avec succès!",
        description: "Votre nouveau vêtement a été ajouté à votre collection.",
      });
      
      // Rediriger vers la liste des vêtements
      navigate("/mes-vetements/liste");
    } catch (error) {
      console.error("Erreur lors de l'ajout du vêtement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'ajout du vêtement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {/* Colonne de gauche: Image */}
      <div className="md:col-span-1">
        <ImageUploader
          form={form}
          user={user}
          detectingColor={detectingColor}
          setDetectingColor={setDetectingColor}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
        />
      </div>
      
      {/* Colonne de droite: Formulaire */}
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VetementFormFields
              form={form}
              categories={categories}
              marques={marques}
              loadingCategories={loadingCategories}
              detectingColor={detectingColor}
            />
            
            <FormActions
              isSubmitting={isSubmitting}
              onCancel={() => navigate("/mes-vetements")}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VetementFormContainer;
