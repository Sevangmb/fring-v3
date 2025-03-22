
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

interface DetectionResultsProps {
  error: string | null;
  steps: string[];
  currentStep: string | null;
  loading: boolean;
}

/**
 * Affiche les résultats et l'état du processus de détection
 */
const DetectionResults: React.FC<DetectionResultsProps> = ({
  error,
  steps,
  currentStep,
  loading
}) => {
  // Si aucune donnée à afficher, ne rien rendre
  if (!error && steps.length === 0 && !currentStep && !loading) {
    return null;
  }
  
  return (
    <div className="w-full mt-4 text-center">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Erreur de détection</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          <span className="text-sm">{currentStep || "Analyse en cours..."}</span>
        </div>
      )}
      
      {!loading && steps.length > 0 && (
        <div className="text-sm text-muted-foreground space-y-1">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <span className="inline-block w-4 h-4 mr-2 rounded-full bg-primary/20 text-xs flex items-center justify-center">
                ✓
              </span>
              {step}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionResults;
