
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
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
            disabled={loadingCategories || loading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={
                  loading 
                    ? "Détection en cours..." 
                    : loadingCategories 
                      ? "Chargement..." 
                      : "Sélectionner une catégorie"
                } />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {loading ? (
                <div className="flex items-center justify-center p-2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                  <span>Détection en cours...</span>
                </div>
              ) : loadingCategories ? (
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
