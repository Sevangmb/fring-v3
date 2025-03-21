
import React, { useState, useRef } from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { detectImageInfo } from "@/services/colorDetectionService";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./VetementFormFields";

interface ImageUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
  detectingColor: boolean;
  setDetectingColor: React.Dispatch<React.SetStateAction<boolean>>;
  imagePreview: string | null;
  setImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  form,
  user,
  detectingColor,
  setDetectingColor,
  imagePreview,
  setImagePreview
}) => {
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
          
          // Détecter les informations de l'image (couleur et catégorie)
          if (publicUrl) {
            setDetectingColor(true);
            try {
              console.log("Envoi de l'image pour détection:", publicUrl.substring(0, 50) + "...");
              const detectedInfo = await detectImageInfo(publicUrl);
              
              console.log("Informations détectées:", detectedInfo);
              
              // Définir la couleur détectée
              form.setValue('couleur', detectedInfo.color);
              
              // Définir la catégorie détectée si disponible
              if (detectedInfo.category) {
                form.setValue('categorie', detectedInfo.category);
              }
              
              toast({
                title: "Détection réussie",
                description: `La couleur ${detectedInfo.color} et la catégorie ${detectedInfo.category} ont été détectées.`,
              });
            } catch (error) {
              console.error("Erreur lors de la détection:", error);
              // Utiliser des valeurs aléatoires en cas d'erreur
              const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
              const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
              form.setValue('couleur', randomColor);
              
              toast({
                title: "Détection partielle",
                description: "La détection automatique a rencontré un problème. Vous pouvez sélectionner manuellement la couleur.",
                variant: "default",
              });
            } finally {
              setDetectingColor(false);
            }
          }
        } catch (error) {
          console.error("Erreur lors du téléchargement de l'image:", error);
          setDetectingColor(false);
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

  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-background flex flex-col items-center justify-center cursor-pointer relative"
        onClick={() => fileInputRef.current?.click()}
      >
        {imagePreview ? (
          <>
            <img 
              src={imagePreview} 
              alt="Aperçu du vêtement" 
              className="w-full h-full object-cover rounded-lg"
            />
            {detectingColor && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-center text-white">
                  <Loader2 size={48} className="mx-auto animate-spin" />
                  <Text className="mt-4 text-white">Détection en cours...</Text>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8">
            <ImagePlus size={48} className="mx-auto text-muted-foreground" />
            <Text className="mt-4">Cliquez pour ajouter une image</Text>
            <Text variant="subtle" className="mt-2">
              JPG, PNG ou GIF. Max 5MB.
            </Text>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
      </div>
      {imagePreview && (
        <Button 
          variant="outline" 
          className="mt-4"
          onClick={() => {
            setImagePreview(null);
            form.setValue('couleur', '');
            form.setValue('categorie', '');
          }}
        >
          Supprimer l'image
        </Button>
      )}
    </div>
  );
};

export default ImageUploader;
