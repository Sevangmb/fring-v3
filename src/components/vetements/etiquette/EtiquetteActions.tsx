
import React from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface EtiquetteActionsProps {
  loading: boolean;
  onUploadClick: (e: React.MouseEvent) => void;
  onCameraClick: (e: React.MouseEvent) => void;
}

/**
 * Boutons d'action pour télécharger ou prendre en photo une étiquette
 */
const EtiquetteActions: React.FC<EtiquetteActionsProps> = ({ 
  loading, 
  onUploadClick, 
  onCameraClick 
}) => {
  const { toast } = useToast();

  const handleCameraClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Notification que la fonctionnalité est en développement
    toast({
      title: "Fonctionnalité en développement",
      description: "La prise de photo sera disponible prochainement.",
    });
    
    // Appel à la fonction parent si nécessaire
    onCameraClick(e);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onUploadClick}
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
        onClick={handleCameraClick}
      >
        <Camera className="mr-2 h-4 w-4" />
        Prendre une photo
      </Button>
    </div>
  );
};

export default EtiquetteActions;
