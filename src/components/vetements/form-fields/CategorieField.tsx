
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";

interface CategorieFieldProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  loadingCategories: boolean;
}

const CategorieField: React.FC<CategorieFieldProps> = ({ 
  form, 
  categories, 
  loadingCategories 
}) => {
  return (
    <FormField
      control={form.control}
      name="categorie"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Catégorie*</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            disabled={loadingCategories}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={loadingCategories ? "Chargement..." : "Sélectionner une catégorie"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loadingCategories ? (
                <div className="flex items-center justify-center p-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Chargement...</span>
                </div>
              ) : (
                categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.nom}>
                    {cat.nom}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorieField;
