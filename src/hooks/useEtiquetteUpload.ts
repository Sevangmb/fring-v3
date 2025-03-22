
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
      
      toast({
        title: "Analyse en cours",
        description: "L'étiquette est en cours d'analyse...",
      });
      
      const { data, error } = await supabase.functions.invoke('analyze-etiquette', {
        body: {
          image: imagePreview,
          userId: user?.id
        },
      });

      if (error) throw new Error(`Erreur lors de l'analyse de l'étiquette: ${error.message}`);
      
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
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        form.setValue('etiquette_image_url', base64Image);
      };
      reader.readAsDataURL(file);

      // Vérifie si on a besoin de télécharger l'image vers Supabase Storage
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Attention",
          description: "L'image est volumineuse, ce qui peut ralentir le traitement.",
          variant: "warning",
        });
      }

      setLoading(true);

      try {
        // 1. Upload de l'image vers le bucket Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `etiquette-${Date.now()}.${fileExt}`;
        
        const { error: bucketError } = await supabase.storage.getBucket('vetements');
        
        // Si le bucket n'existe pas, on le crée
        if (bucketError && bucketError.message.includes('does not exist')) {
          await supabase.storage.createBucket('vetements', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
        }
        
        const { data, error } = await supabase.storage
          .from('vetements')
          .upload(`etiquettes/${fileName}`, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error("Erreur d'upload:", error);
          toast({
            title: "Erreur d'upload",
            description: "Impossible de télécharger l'image. L'image locale sera utilisée.",
            variant: "destructive",
          });
          // En cas d'erreur, on garde l'image locale
          setLoading(false);
          return;
        }
        
        // 2. Obtenir l'URL publique
        const { data: publicUrlData } = supabase.storage
          .from('vetements')
          .getPublicUrl(`etiquettes/${fileName}`);
        
        // Mettre à jour le formulaire avec l'URL de l'image
        form.setValue('etiquette_image_url', publicUrlData.publicUrl);
        
        toast({
          title: "Image téléchargée",
          description: "L'image a été téléchargée avec succès.",
        });
      } catch (uploadError) {
        console.error("Erreur lors de l'upload:", uploadError);
        toast({
          title: "Erreur d'upload",
          description: "Problème lors du téléchargement. L'image locale sera utilisée.",
          variant: "destructive",
        });
      }
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
