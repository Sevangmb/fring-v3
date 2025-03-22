
import React from "react";
import DetectionErrorMessage from "./DetectionErrorMessage";

interface DetectionResultsProps {
  error: string | null;
  steps?: string[];
  currentStep?: string;
  loading: boolean;
}

/**
 * Composant pour afficher les résultats de détection et les erreurs éventuelles
 */
const DetectionResults: React.FC<DetectionResultsProps> = ({ 
  error,
  steps,
  currentStep,
  loading
}) => {
  if (loading) {
    return (
      <div className="mt-3 p-3 bg-primary/10 rounded-md">
        <p className="text-primary text-sm">Analyse en cours...</p>
      </div>
    );
  }
  
  if (!error && (!steps || steps.length === 0) && !currentStep) {
    return null;
  }
  
  return (
    <DetectionErrorMessage 
      error={error} 
      steps={steps} 
      currentStep={currentStep} 
    />
  );
};

export default DetectionResults;
