
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { ImagePlus, Loader2, Trash2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImagePreviewAreaProps {
  imagePreview: string | null;
  loading: boolean;
  onClick: () => void;
  onDelete?: () => void;
  onDetect?: () => void;
  detectingColor?: boolean;
}

/**
 * Composant pour afficher une prévisualisation d'image avec état de chargement
 * et les actions (supprimer/détecter) directement sur l'image
 */
const ImagePreviewArea: React.FC<ImagePreviewAreaProps> = ({ 
  imagePreview, 
  loading,
  onClick,
  onDelete,
  onDetect,
  detectingColor = false
}) => {
  return (
    <div 
      className="w-full aspect-square rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors bg-background flex flex-col items-center justify-center cursor-pointer relative"
      onClick={imagePreview ? undefined : onClick}
    >
      {imagePreview ? (
        <>
          <img 
            src={imagePreview} 
            alt="Aperçu du vêtement" 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Actions flottantes sur l'image */}
          {!loading && (
            <div className="absolute bottom-3 right-3 flex gap-2">
              {onDelete && (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  title="Supprimer l'image"
                >
                  <Trash2 size={16} />
                </Button>
              )}
              
              {onDetect && (
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDetect();
                  }}
                  disabled={detectingColor}
                  title="Détecter avec Google AI"
                >
                  <Palette size={16} className={detectingColor ? "animate-pulse" : ""} />
                </Button>
              )}
            </div>
          )}
          
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
