
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { ImagePlus, Loader2 } from "lucide-react";

interface ImagePreviewAreaProps {
  imagePreview: string | null;
  loading: boolean;
  onClick: () => void;
}

/**
 * Composant pour afficher une prévisualisation d'image avec état de chargement
 */
const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({ 
  imagePreview, 
  loading,
  onClick 
}) => {
  return (
    <div 
      className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-background flex flex-col items-center justify-center cursor-pointer relative"
      onClick={onClick}
    >
      {imagePreview ? (
        <>
          <img 
            src={imagePreview} 
            alt="Aperçu du vêtement" 
            className="w-full h-full object-cover rounded-lg"
          />
          {loading && (
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
    </div>
  );
};

export default ImagePreviewArea;
