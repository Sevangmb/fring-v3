
import React, { useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import { Button } from "@/components/ui/button";
import { Loader2, ScanText, Upload, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EtiquetteUploaderProps {
  form: UseFormReturn<VetementFormValues>;
  user: any;
}

const EtiquetteUploader: React.FC<EtiquetteUploaderProps> = ({ form, user }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Record<string, string> | null>(null);

  // Gérer le changement d'image
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
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyser l'étiquette avec OCR
  const analyzeEtiquette = async () => {
    if (!imagePreview) {
      toast({
        title: "Erreur",
        description: "Veuillez d'abord télécharger une image de l'étiquette.",
        variant: "destructive",
      });
      return;
    }

    try {
      setScanning(true);
      
      // Appel à l'API d'OCR Google AI
      const response = await fetch("/api/analyze-etiquette", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imagePreview,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse de l'étiquette");
      }

      const data = await response.json();
      
      // Afficher les résultats
      setScanResults(data.results);
      
      toast({
        title: "Succès",
        description: "L'étiquette a été analysée avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'analyse de l'étiquette.",
        variant: "destructive",
      });
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50">
        {imagePreview ? (
          <div className="w-full">
            <div className="relative mb-3">
              <img 
                src={imagePreview} 
                alt="Aperçu de l'étiquette" 
                className="max-h-64 max-w-full mx-auto rounded-md"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setImagePreview(null)}
              >
                Changer
              </Button>
            </div>
            
            <Button
              onClick={analyzeEtiquette}
              className="w-full"
              disabled={scanning}
            >
              {scanning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <ScanText className="mr-2 h-4 w-4" />
                  Analyser l'étiquette
                </>
              )}
            </Button>
          </div>
        ) : (
          <>
            <Tag className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Télécharger une image d'étiquette</h3>
            <p className="text-muted-foreground text-center mb-4">
              Prenez une photo claire de l'étiquette de votre vêtement pour extraire automatiquement les informations.
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Sélectionner une image
            </Button>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
            />
          </>
        )}
      </div>

      {scanResults && (
        <div className="mt-6 p-4 border rounded-md bg-background">
          <h3 className="font-medium mb-3">Informations détectées :</h3>
          <dl className="space-y-2">
            {Object.entries(scanResults).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-4">
                <dt className="text-sm font-medium text-muted-foreground">{key}</dt>
                <dd className="text-sm col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

export default EtiquetteUploader;
