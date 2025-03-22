
import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, Loader2, ScanText, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface EtiquetteUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
}

const EtiquetteUploader: React.FC<EtiquetteUploaderProps> = ({ form, user }) => {
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
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-etiquette`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            imageUrl: imagePreview,
          }),
        }
      );

      if (!response.ok) throw new Error('Erreur lors de l\'analyse de l\'étiquette');
      
      const data = await response.json();
      
      // Mettre à jour le formulaire avec les données extraites
      if (data.results) {
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

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleButtonClick}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Sélectionner une image d'étiquette
          </Button>
          
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              // Logique pour prendre une photo (à implémenter si nécessaire)
              toast({
                title: "Fonctionnalité en développement",
                description: "La prise de photo sera disponible prochainement.",
              });
            }}
          >
            <Camera className="mr-2 h-4 w-4" />
            Prendre une photo
          </Button>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        {imagePreview && (
          <div className="mt-4 relative">
            <img 
              src={imagePreview} 
              alt="Aperçu de l'étiquette" 
              className="w-full max-h-48 object-contain rounded-md border"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
              </div>
            )}
            
            {/* Actions pour l'image */}
            {!loading && imagePreview && (
              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="rounded-full shadow-md"
                  onClick={handleDeleteImage}
                  title="Supprimer l'image"
                >
                  <Trash2 size={16} />
                </Button>
                
                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  className="rounded-full shadow-md"
                  onClick={handleAnalyzeEtiquette}
                  title="Analyser l'étiquette"
                >
                  <ScanText size={16} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-4 mt-6">
        <div>
          <Label htmlFor="composition">Composition</Label>
          <Textarea
            id="composition"
            placeholder="Composition du vêtement (ex: 100% coton)"
            {...form.register('composition')}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="instructions_lavage">Instructions de lavage</Label>
          <Textarea
            id="instructions_lavage"
            placeholder="Instructions de lavage (ex: Lavage à 30°C)"
            {...form.register('instructions_lavage')}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="pays_fabrication">Pays de fabrication</Label>
          <Input
            id="pays_fabrication"
            placeholder="Pays de fabrication (ex: Italie)"
            {...form.register('pays_fabrication')}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default EtiquetteUploader;
