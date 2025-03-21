
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";

interface CategorieFieldProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  loadingCategories: boolean;
  loading: boolean;
}

const CategorieField: React.FC<CategorieFieldProps> = ({ 
  form, 
  categories, 
  loadingCategories,
  loading
}) => {
  // Récupérer la valeur actuelle pour l'afficher dans le label si elle existe
  const categorieValue = form.watch('categorie');
  const hasDetectedValue = !!categorieValue && !loading;

  return (
    <FormField
      control={form.control}
      name="categorie"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Catégorie*
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détectée)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input 
              placeholder={loading ? "Détection en cours..." : "Entrez la catégorie"} 
              {...field}
              disabled={loading}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorieField;
