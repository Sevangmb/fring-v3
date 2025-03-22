
import React from "react";
import { Loader2, ScanText, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EtiquettePreviewProps {
  imagePreview: string | null;
  loading: boolean;
  onDelete: (e: React.MouseEvent) => void;
  onAnalyze: (e: React.MouseEvent) => void;
}

/**
 * Affiche l'aperçu de l'image d'étiquette avec des boutons d'action
 */
const EtiquettePreview: React.FC<EtiquettePreviewProps> = ({
  imagePreview,
  loading,
  onDelete,
  onAnalyze
}) => {
  if (!imagePreview) return null;

  return (
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
            onClick={onDelete}
            title="Supprimer l'image"
          >
            <Trash2 size={16} />
          </Button>
          
          <Button
            type="button"
            variant="default"
            size="icon"
            className="rounded-full shadow-md"
            onClick={onAnalyze}
            title="Analyser l'étiquette"
          >
            <ScanText size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EtiquettePreview;
