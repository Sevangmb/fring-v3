import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addVetement } from "@/services/vetementService";
import VetementFormFields, { vetementSchema, VetementFormValues } from "./VetementFormFields";
import ImageUploader from "./ImageUploader";
import FormActions from "./FormActions";
import { useImagePreview } from "@/hooks/useImagePreview";

interface VetementFormContainerProps {
  user: any;
  categories: any[];
  marques: any[];
  loadingCategories: boolean;
  initialValues?: VetementFormValues;
  onSubmit?: (data: VetementFormValues) => Promise<void>;
  submitLabel?: string;
  submitIcon?: React.ReactNode;
  mode?: "create" | "update";
}

const VetementFormContainer: React.FC<VetementFormContainerProps> = ({
  user,
  categories,
  marques,
  loadingCategories,
  initialValues,
  onSubmit,
  submitLabel,
  submitIcon,
  mode = "create"
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
    defaultValues: initialValues || {
      nom: "",
      categorie: "",
      couleur: "",
      taille: "",
      description: "",
      marque: "",
      image_url: "",
    },
  });

  // Mettre à jour l'aperçu de l'image si initialValues contient une image_url
  useEffect(() => {
    if (initialValues?.image_url) {
      setImagePreview(initialValues.image_url);
    }
  }, [initialValues, setImagePreview]);

  const handleSubmit = async (data: VetementFormValues) => {
    if (!user) {
      toast({
        title: "Non autorisé",
        description: "Vous devez être connecté pour gérer vos vêtements.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (mode === "update" && onSubmit) {
        // En mode modification, utiliser la fonction onSubmit personnalisée
        await onSubmit({
          ...data,
          image_url: imagePreview || undefined,
        });
      } else {
        // En mode création, utiliser addVetement
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
      }
    } catch (error) {
      console.error("Erreur lors de la gestion du vêtement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la gestion du vêtement.",
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
              submitLabel={submitLabel || (mode === "create" ? "Ajouter le vêtement" : "Enregistrer les modifications")}
              submitIcon={submitIcon}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default VetementFormContainer;
