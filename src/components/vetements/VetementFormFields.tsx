
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "./schema/VetementFormSchema";
import NomField from "./form-fields/NomField";
import CategorieField from "./form-fields/CategorieField";
import CouleurField from "./form-fields/CouleurField";
import TailleField from "./form-fields/TailleField";
import MarqueField from "./form-fields/MarqueField";
import DescriptionField from "./form-fields/DescriptionField";
import TemperatureField from "./form-fields/TemperatureField";
import WeatherTypeField from "./form-fields/WeatherTypeField";

interface VetementFormFieldsProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  marques: any[];
  loadingCategories: boolean;
  loading: boolean;
}

/**
 * Tous les champs du formulaire de vêtement
 */
const VetementFormFields: React.FC<VetementFormFieldsProps> = ({
  form,
  categories,
  marques,
  loadingCategories,
  loading
}) => {
  return (
    <div className="space-y-4">
      <NomField form={form} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategorieField 
          form={form} 
          categories={categories} 
          loadingCategories={loadingCategories} 
          loading={loading}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TemperatureField form={form} />
        <WeatherTypeField form={form} />
      </div>
      
      <DescriptionField form={form} />
    </div>
  );
};

export default VetementFormFields;
