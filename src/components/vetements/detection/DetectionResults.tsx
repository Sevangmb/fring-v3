
import React from "react";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Text } from "@/components/atoms/Typography";
import { DetectionStep } from "@/hooks/useDetection";

interface DetectionResultsProps {
  error: string | null;
  steps: DetectionStep[];
  currentStep: string | null;
  loading: boolean;
}

/**
 * Composant d'affichage des résultats de détection avec les étapes du processus
 */
const DetectionResults: React.FC<DetectionResultsProps> = ({ 
  error, 
  steps, 
  currentStep,
  loading 
}) => {
  const hasSteps = steps && steps.length > 0;
  const hasError = error !== null;
  
  if (!hasError && !hasSteps && !loading) return null;
  
  return (
    <div className="mt-3 space-y-2 w-full">
      {loading && (
        <div className="flex items-center gap-2 text-primary bg-primary/10 p-3 rounded-md">
          <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          <Text className="text-primary text-sm font-medium">
            {currentStep || "Détection en cours..."}
          </Text>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertTriangle size={18} />
          <Text className="text-destructive text-sm font-medium">{error}</Text>
        </div>
      )}
      
      {hasSteps && (
        <Accordion type="single" collapsible className="w-full border rounded-md">
          <AccordionItem value="steps">
            <AccordionTrigger className="text-sm font-medium flex items-center gap-2 px-3 py-2">
              <Info size={16} />
              Détails du processus de détection ({steps.length} étapes)
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-2">
              <ul className="text-sm space-y-2 mt-1 pl-2">
                {steps.map((step, index) => {
                  // Déterminer si c'est une étape d'erreur
                  const isError = step.label.toLowerCase().includes('erreur');
                  // Déterminer si c'est une étape finale réussie
                  const isSuccess = step.completed && (
                    step.label.toLowerCase().includes('terminée') || 
                    step.id === 'complete'
                  );
                  
                  return (
                    <li key={index} 
                        className={`flex items-start gap-2 py-1 px-2 rounded-sm ${
                          isError ? 'text-destructive bg-destructive/5' : 
                          isSuccess ? 'text-green-600 bg-green-50' : 
                          'text-muted-foreground'
                        }`}>
                      {isError ? (
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      ) : isSuccess ? (
                        <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      ) : (
                        <span className="inline-block w-4 h-4 rounded-full bg-muted text-[10px] flex items-center justify-center font-semibold shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                      )}
                      <span>{step.label}{step.description ? `: ${step.description}` : ''}</span>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default DetectionResults;
