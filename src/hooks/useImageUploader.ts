
import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "@/components/vetements/schema/VetementFormSchema";
import { useToast } from "@/hooks/use-toast";
import { useDetection } from "./useDetection";

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

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenFileSelector = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    setImagePreview(null);
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
