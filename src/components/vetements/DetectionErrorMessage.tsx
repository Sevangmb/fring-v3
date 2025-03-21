
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { AlertTriangle, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface DetectionErrorMessageProps {
  error: string | null;
  steps?: string[];
}

/**
 * Composant pour afficher un message d'erreur de détection
 */
const DetectionErrorMessage: React.FC<DetectionErrorMessageProps> = ({ error, steps = [] }) => {
  const hasSteps = steps && steps.length > 0;
  
  if (!error && !hasSteps) return null;
  
  return (
    <div className="mt-2 space-y-2">
      {error && (
        <div className="flex items-center gap-2 text-destructive">
          <AlertTriangle size={16} />
          <Text className="text-destructive text-sm">{error}</Text>
        </div>
      )}
      
      {hasSteps && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="steps">
            <AccordionTrigger className="text-sm font-medium flex items-center gap-2">
              <Info size={16} />
              Détails du processus de détection
            </AccordionTrigger>
            <AccordionContent>
              <ul className="text-sm space-y-1 mt-2 pl-6 list-disc">
                {steps.map((step, index) => (
                  <li key={index} className="text-muted-foreground">
                    {step}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

export default DetectionErrorMessage;
