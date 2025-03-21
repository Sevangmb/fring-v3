
import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook personnalisé pour gérer le téléchargement et la prévisualisation d'images
 */
export const useImageUpload = (user: any, setImagePreview: (preview: string | null) => void) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
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
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        setImagePreview(base64Image);
        
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour télécharger des images.",
            variant: "destructive",
          });
          return;
        }

        // Télécharger l'image sur Supabase Storage ou utiliser le base64 directement
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          // Vérifier si le bucket "vetements" existe, sinon on utilise une URL locale
          const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('vetements');
          
          let publicUrl = '';
          
          if (bucketError) {
            console.warn("Le bucket 'vetements' n'existe pas, l'image sera stockée localement", bucketError);
            // On garde l'image en local avec le dataURL
            publicUrl = base64Image;
          } else {
            const { data, error } = await supabase.storage
              .from('vetements')
              .upload(`images/${fileName}`, file);

            if (error) {
              console.error("Erreur lors du téléchargement de l'image:", error);
              // Utiliser l'image en base64 en cas d'erreur
              publicUrl = base64Image;
              toast({
                title: "Note",
                description: "L'image sera utilisée localement sans être stockée en ligne.",
              });
            } else {
              // Obtenir l'URL publique de l'image
              const { data: { publicUrl: storedPublicUrl } } = supabase.storage
                .from('vetements')
                .getPublicUrl(`images/${fileName}`);
                
              publicUrl = storedPublicUrl;
            }
            
            setImagePreview(publicUrl);
          }
        } catch (error) {
          console.error("Erreur lors du téléchargement de l'image:", error);
          toast({
            title: "Erreur",
            description: "Une erreur s'est produite lors du traitement de l'image.",
            variant: "destructive",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return {
    fileInputRef,
    handleImageChange
  };
};
