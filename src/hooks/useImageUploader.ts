
import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { useToast } from "@/hooks/use-toast";
import { useDetection } from "./useDetection";
import { supabase } from "@/lib/supabase";

export const useImageUploader = (
  form: UseFormReturn<VetementFormValues>,
  user: any,
  imagePreview: string | null,
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { 
    loading,
    error,
    steps,
    currentStep,
    detectImage
  } = useDetection(form, imagePreview);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image est trop volumineuse. La taille maximale est de 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Afficher une prévisualisation
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        form.setValue('image_url', base64Image);
        
        // Vérifions si nous pouvons télécharger l'image sur Supabase
        if (user) {
          try {
            const fileExt = file.name.split('.').pop();
            const fileName = `vetement-${Date.now()}.${fileExt}`;
            
            // Vérifier si le bucket "vetements" existe
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
              .upload(`images/${fileName}`, file, {
                cacheControl: '3600',
                upsert: true
              });

            if (error) {
              console.error("Erreur lors du téléchargement de l'image:", error);
              // On garde l'image locale en cas d'erreur
              return;
            }
            
            // Obtenir l'URL publique de l'image
            const { data: publicUrlData } = supabase.storage
              .from('vetements')
              .getPublicUrl(`images/${fileName}`);
              
            form.setValue('image_url', publicUrlData.publicUrl);
            setImagePreview(publicUrlData.publicUrl);
          } catch (uploadError) {
            console.error("Erreur lors de l'upload:", uploadError);
            // Utiliser le base64 en cas d'erreur
          }
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement de l'image.",
        variant: "destructive",
      });
    }
  };

  const handleOpenFileSelector = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
    form.setValue('image_url', null);
    form.setValue('couleur', '');
    form.setValue('categorie_id', 0);
  };

  return {
    fileInputRef,
    loading,
    error,
    steps,
    currentStep,
    handleImageChange,
    handleOpenFileSelector,
    handleDeleteImage,
    detectImage
  };
};
