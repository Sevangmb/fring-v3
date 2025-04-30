
import React from 'react';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface DetectionResultsProps {
  error: string | null;
  steps: string[];
  currentStep: string | null;
  loading: boolean;
}

/**
 * Affiche les résultats et le progrès de la détection d'attributs de vêtements
 */
const DetectionResults: React.FC<DetectionResultsProps> = ({
  error,
  steps,
  currentStep,
  loading
}) => {
  if (!loading && !error && (!steps || steps.length === 0)) {
    return null;
  }

  const currentStepIndex = currentStep ? parseInt(currentStep) : -1;

  return (
    <div className="w-full mt-2">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading && steps && steps.length > 0 && (
        <div className="space-y-2">
          {steps.map((step, index) => (
            <div 
              key={step} 
              className={`flex items-center gap-2 text-sm ${
                index < currentStepIndex 
                  ? 'text-muted-foreground' 
                  : index === currentStepIndex 
                    ? 'text-primary' 
                    : 'text-muted-foreground/50'
              }`}
            >
              {index < currentStepIndex ? (
                <CheckCircle size={16} className="text-primary" />
              ) : index === currentStepIndex ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-muted-foreground/30" />
              )}
              <span>{step}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetectionResults;
