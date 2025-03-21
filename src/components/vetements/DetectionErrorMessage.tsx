
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { AlertTriangle } from "lucide-react";

interface DetectionErrorMessageProps {
  error: string | null;
}

/**
 * Composant pour afficher un message d'erreur de détection
 */
const DetectionErrorMessage: React.FC<DetectionErrorMessageProps> = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className="mt-2 flex items-center gap-2 text-destructive">
      <AlertTriangle size={16} />
      <Text className="text-destructive text-sm">{error}</Text>
    </div>
  );
};

export default DetectionErrorMessage;
