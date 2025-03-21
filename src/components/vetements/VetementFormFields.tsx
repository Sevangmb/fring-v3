
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Categorie, Marque, VetementFormValues, vetementSchema } from "./schema/VetementFormSchema";
import NomField from "./form-fields/NomField";
import CategorieField from "./form-fields/CategorieField";
import CouleurField from "./form-fields/CouleurField";
import TailleField from "./form-fields/TailleField";
import MarqueField from "./form-fields/MarqueField";
import DescriptionField from "./form-fields/DescriptionField";

interface VetementFormFieldsProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  marques: Marque[];
  loadingCategories: boolean;
  detectingColor: boolean;
}

const VetementFormFields: React.FC<VetementFormFieldsProps> = ({
  form,
  categories,
  marques,
  loadingCategories,
  detectingColor,
}) => {
  return (
    <>
      {/* Nom */}
      <NomField form={form} />
      
      {/* Ligne: Catégorie et Couleur */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CategorieField 
          form={form}
          categories={categories}
          loadingCategories={loadingCategories}
          detectingColor={detectingColor}
        />
        <CouleurField 
          form={form}
          detectingColor={detectingColor}
        />
      </div>
      
      {/* Ligne: Taille et Marque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <TailleField form={form} />
        <MarqueField form={form} marques={marques} />
      </div>
      
      {/* Description */}
      <DescriptionField form={form} />
    </>
  );
};

// Export the schema and types for external use
export { vetementSchema };
export type { VetementFormValues };

export default VetementFormFields;
