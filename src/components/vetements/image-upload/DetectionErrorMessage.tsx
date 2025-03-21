
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { AlertTriangle, Info, CheckCircle, Loader2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DetectionErrorMessageProps {
  error: string | null;
  steps?: string[];
  currentStep?: string;
}

/**
 * Composant pour afficher un message d'erreur de détection et les étapes du processus
 * avec des indicateurs visuels d'avancement
 */
const DetectionErrorMessage: React.FC<DetectionErrorMessageProps> = ({ 
  error, 
  steps = [],
  currentStep
}) => {
  const hasSteps = steps && steps.length > 0;
  const hasError = error !== null;
  
  if (!hasError && !hasSteps) return null;
  
  return (
    <div className="mt-3 space-y-2 w-full">
      {error && (
        <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md">
          <AlertTriangle size={18} />
          <Text className="text-destructive text-sm font-medium">{error}</Text>
        </div>
      )}
      
      {hasSteps && (
        <Accordion type="single" collapsible className="w-full border rounded-md" defaultValue="steps">
          <AccordionItem value="steps">
            <AccordionTrigger className="text-sm font-medium flex items-center gap-2 px-3 py-2">
              {currentStep ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Info size={16} />
              )}
              <span>
                Détails du processus de détection ({steps.length} étapes)
                {currentStep && (
                  <span className="ml-2 text-muted-foreground font-normal">
                    - {currentStep}
                  </span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-2">
              <ul className="text-sm space-y-2 mt-1 pl-2">
                {steps.map((step, index) => {
                  // Déterminer si c'est une étape d'erreur
                  const isError = step.toLowerCase().includes('erreur');
                  // Déterminer si c'est une étape finale réussie
                  const isSuccess = step.toLowerCase().includes('application des valeurs') || 
                                   step.toLowerCase().includes('détection terminée');
                  // Déterminer si c'est l'étape actuelle
                  const isCurrent = currentStep === step;
                  
                  return (
                    <li key={index} 
                        className={`flex items-start gap-2 py-1 px-2 rounded-sm ${
                          isError ? 'text-destructive bg-destructive/5' : 
                          isSuccess ? 'text-green-600 bg-green-50' : 
                          isCurrent ? 'text-primary bg-primary/5' :
                          'text-muted-foreground'
                        }`}>
                      {isError ? (
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      ) : isSuccess ? (
                        <CheckCircle size={14} className="mt-0.5 shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 size={14} className="mt-0.5 shrink-0 animate-spin" />
                      ) : (
                        <CheckCircle size={14} className="mt-0.5 shrink-0 text-muted" />
                      )}
                      <span>{step}</span>
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

export default DetectionErrorMessage;
