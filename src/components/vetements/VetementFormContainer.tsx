
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { addVetement } from "@/services/vetement";
import VetementFormFields from "./VetementFormFields";
import { vetementFormSchema, VetementFormValues } from "./schema/VetementFormSchema";
import ImageUploader from "./ImageUploader";
import FormActions from "./FormActions";

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Initialiser le formulaire avec react-hook-form
  const form = useForm<VetementFormValues>({
    resolver: zodResolver(vetementFormSchema),
    defaultValues: initialValues || {
      nom: "",
      categorie: "",
      couleur: "",
      taille: "",
      description: "",
      marque: "",
      temperature: undefined,
      image_url: "",
    },
  });
  
  // Synchroniser les valeurs initiales lorsqu'elles changent
  useEffect(() => {
    if (initialValues) {
      console.log("Initialisation du formulaire avec:", initialValues);
      
      // Réinitialiser le formulaire avec les nouvelles valeurs
      Object.entries(initialValues).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id' && key !== 'created_at' && key !== 'user_id') {
          form.setValue(key as keyof VetementFormValues, value === null ? "" : value);
        }
      });
      
      // Mise à jour de l'aperçu de l'image si disponible
      if (initialValues.image_url) {
        setImagePreview(initialValues.image_url);
      }
    }
  }, [initialValues, form]);
  
  // Debug des valeurs du formulaire
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form value changed:", name, value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
      console.log("===== DÉBUT SOUMISSION FORMULAIRE =====");
      console.log("Données brutes du formulaire:", data);
      
      // S'assurer que l'image_url est correctement définie
      const formDataWithImage = {
        ...data,
        image_url: imagePreview || data.image_url || null,
      };
      
      console.log("Données complètes avec image:", formDataWithImage);
      
      if (mode === "update" && onSubmit) {
        // En mode modification, utiliser la fonction onSubmit personnalisée
        await onSubmit(formDataWithImage);
      } else {
        // En mode création, utiliser addVetement
        await addVetement({
          nom: formDataWithImage.nom,
          categorie: formDataWithImage.categorie,
          couleur: formDataWithImage.couleur,
          taille: formDataWithImage.taille,
          description: formDataWithImage.description || null,
          marque: formDataWithImage.marque || null,
          image_url: formDataWithImage.image_url || null,
          temperature: formDataWithImage.temperature || null,
        });
        
        toast({
          title: "Vêtement ajouté avec succès!",
          description: "Votre nouveau vêtement a été ajouté à votre collection.",
        });
        
        // Rediriger vers la liste des vêtements
        navigate("/mes-vetements/liste");
      }
      
      console.log("===== FIN SOUMISSION FORMULAIRE =====");
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
              loading={loading}
            />
            
            <FormActions
              isSubmitting={isSubmitting}
              onCancel={() => navigate("/mes-vetements/liste")}
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
