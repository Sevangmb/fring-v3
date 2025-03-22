
import React from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, Upload } from "lucide-react";

interface ImageActionsProps {
  onUploadClick: (e: React.MouseEvent) => void;
  loading: boolean;
}

/**
 * Boutons d'action pour télécharger une image de vêtement
 */
const ImageActions: React.FC<ImageActionsProps> = ({ 
  onUploadClick,
  loading
}) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onUploadClick}
        disabled={loading}
      >
        <Upload className="mr-2 h-4 w-4" />
        Sélectionner une image
      </Button>
    </div>
  );
};

export default ImageActions;
