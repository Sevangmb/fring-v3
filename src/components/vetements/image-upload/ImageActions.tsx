
import React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface ImageActionsProps {
  imagePreview: string | null;
  detectingColor: boolean;
  onDetect: () => void;
  onDelete: () => void;
}

/**
 * Composant pour les actions liées à l'image (supprimer, détecter)
 */
const ImageActions: React.FC<ImageActionsProps> = ({
  imagePreview,
  detectingColor,
  onDetect,
  onDelete
}) => {
  if (!imagePreview) return null;
  
  return (
    <div className="flex gap-4 mt-4">
      <Button 
        variant="outline" 
        onClick={onDelete}
      >
        Supprimer l'image
      </Button>
      <Button 
        variant="default"
        onClick={onDetect}
        disabled={detectingColor}
        className="flex items-center gap-2"
      >
        <Palette size={16} /> Détecter couleur et catégorie
      </Button>
    </div>
  );
};

export default ImageActions;
