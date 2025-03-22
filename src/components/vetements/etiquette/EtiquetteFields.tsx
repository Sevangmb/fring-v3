
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EtiquetteFieldsProps {
  form: UseFormReturn<VetementFormValues>;
}

/**
 * Champs de formulaire pour les informations d'étiquette
 */
const EtiquetteFields: React.FC<EtiquetteFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      <div>
        <Label htmlFor="composition">Composition</Label>
        <Textarea
          id="composition"
          placeholder="Composition du vêtement (ex: 100% coton)"
          {...form.register('composition')}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="instructions_lavage">Instructions de lavage</Label>
        <Textarea
          id="instructions_lavage"
          placeholder="Instructions de lavage (ex: Lavage à 30°C)"
          {...form.register('instructions_lavage')}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="pays_fabrication">Pays de fabrication</Label>
        <Input
          id="pays_fabrication"
          placeholder="Pays de fabrication (ex: Italie)"
          {...form.register('pays_fabrication')}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default EtiquetteFields;
