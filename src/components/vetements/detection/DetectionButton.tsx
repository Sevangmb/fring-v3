
import React from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface DetectionButtonProps {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}

/**
 * Bouton pour lancer la détection automatique
 */
const DetectionButton: React.FC<DetectionButtonProps> = ({
  onClick,
  loading,
  disabled
}) => {
  return (
    <Button 
      variant="default"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2"
    >
      {loading ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
          Détection en cours...
        </>
      ) : (
        <>
          <Palette size={16} /> Détecter avec Google AI
        </>
      )}
    </Button>
  );
};

export default DetectionButton;
