import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "./schema/VetementFormSchema";
import NomField from "./form-fields/NomField";
import CategorieField from "./form-fields/CategorieField";
import CouleurField from "./form-fields/CouleurField";
import TailleField from "./form-fields/TailleField";
import MarqueField from "./form-fields/MarqueField";
import DescriptionField from "./form-fields/DescriptionField";
import TemperatureField from "./form-fields/TemperatureField";
import WeatherTypeField from "./form-fields/WeatherTypeField";
import { Tag } from "lucide-react";

interface VetementFormFieldsProps {
  form: UseFormReturn<VetementFormValues>;
  marques: any[];
  loading: boolean;
  onCategoriesChange?: () => void;
  activeTab?: string;
}

/**
 * Tous les champs du formulaire de vêtement
 * Utilise les relations avec les tables catégories et marques
 */
const VetementFormFields: React.FC<VetementFormFieldsProps> = ({
  form,
  marques,
  loading,
  onCategoriesChange,
  activeTab = "principal"
}) => {
  if (activeTab === "principal") {
    return (
      <div className="space-y-4">
        <NomField form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CategorieField 
            form={form} 
            loading={loading}
            onCategoriesChange={onCategoriesChange}
          />
          <CouleurField 
            form={form} 
            loading={loading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TailleField form={form} />
          <MarqueField form={form} marques={marques} />
        </div>
      </div>
    );
  }
  
  if (activeTab === "supplementaire") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TemperatureField form={form} />
          <WeatherTypeField form={form} />
        </div>
        
        <DescriptionField form={form} />
      </div>
    );
  }
  
  if (activeTab === "etiquette") {
    return (
      <div className="space-y-4">
        <div className="p-6 bg-muted/30 rounded-lg border border-muted">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Tag className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium">Informations d'étiquette</h3>
            <p className="text-muted-foreground">
              Cette section vous permettra d'ajouter des informations détaillées sur l'étiquette du vêtement comme les instructions de lavage, la composition des matériaux, etc.
            </p>
            <p className="text-sm text-muted-foreground">
              Cette fonctionnalité sera bientôt disponible.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return null;
};

export default VetementFormFields;
