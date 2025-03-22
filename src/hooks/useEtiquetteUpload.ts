import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../components/vetements/schema/VetementFormSchema";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const useEtiquetteUpload = (
  form: UseFormReturn<VetementFormValues>,
  user: any
) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(
    form.getValues().etiquette_image_url || null
  );

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleDeleteImage = (e: React.MouseEvent) => {
    e.preventDefault();
    setImagePreview(null);
    form.setValue('etiquette_image_url', null);
  };

  const handleAnalyzeEtiquette = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!imagePreview) return;
    
    try {
      setLoading(true);
      
      // Envoi à l'Edge Function pour analyse
      toast({
        title: "Analyse en cours",
        description: "L'étiquette est en cours d'analyse...",
      });
      
      // Corriger ici - utiliser les bons paramètres pour la requête
      const { data, error } = await supabase.functions.invoke('analyze-etiquette', {
        body: {
          image: imagePreview,
          userId: user?.id
        },
      });

      if (error) throw new Error(`Erreur lors de l'analyse de l'étiquette: ${error.message}`);
      
      // Mettre à jour le formulaire avec les données extraites
      if (data && data.results) {
        const results = data.results;
        
        if (results.Composition) {
          form.setValue('composition', results.Composition);
        }
        
        if (results["Instructions de lavage"]) {
          form.setValue('instructions_lavage', results["Instructions de lavage"]);
        }
        
        if (results["Pays de fabrication"]) {
          form.setValue('pays_fabrication', results["Pays de fabrication"]);
        }
        
        toast({
          title: "Succès",
          description: "L'étiquette a été analysée avec succès.",
        });
      } else {
        throw new Error('Résultats de l\'analyse non disponibles');
      }
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast({
        title: "Erreur d'analyse",
        description: "Impossible d'analyser l'étiquette. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Afficher l'aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Télécharger l'image
      setLoading(true);

      // 1. Upload de l'image vers le bucket Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `etiquette-${Date.now()}.${fileExt}`;
      
      let uploadResult;
      try {
        uploadResult = await supabase.storage
          .from('vetements')
          .upload(`etiquettes/${fileName}`, file);
        
        if (uploadResult.error) throw uploadResult.error;
      } catch (error) {
        console.error("Erreur d'upload:", error);
        toast({
          title: "Erreur d'upload",
          description: "Impossible de télécharger l'image. Utilisation de l'image locale.",
          variant: "destructive",
        });
        // En cas d'erreur, on utilise l'image locale
        form.setValue('etiquette_image_url', reader.result as string);
        setLoading(false);
        return;
      }

      // 2. Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('vetements')
        .getPublicUrl(`etiquettes/${fileName}`);
      
      // Enregistrer l'URL de l'image
      form.setValue('etiquette_image_url', publicUrlData.publicUrl);
      
      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès. Vous pouvez maintenant l'analyser.",
      });
    } catch (error) {
      console.error("Erreur:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement de l'image.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    imagePreview,
    fileInputRef,
    handleButtonClick,
    handleDeleteImage,
    handleAnalyzeEtiquette,
    handleImageChange
  };
};
