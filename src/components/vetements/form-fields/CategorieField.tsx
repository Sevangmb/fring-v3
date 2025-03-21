
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";
import { CategorySelector } from "./category/CategorySelector";
import { AddCategoryDialog } from "./category/AddCategoryDialog";

interface CategorieFieldProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  loadingCategories: boolean;
  loading: boolean;
  onCategoriesChange?: () => void;
}

const CategorieField: React.FC<CategorieFieldProps> = ({ 
  form, 
  categories, 
  loadingCategories,
  loading,
  onCategoriesChange
}) => {
  const categorieId = form.watch('categorie_id');
  const hasDetectedValue = !!categorieId && !loading;
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleCategorySelect = (categoryId: number) => {
    form.setValue('categorie_id', categoryId, { shouldValidate: true });
  };

  const selectedCategory = categories.find(cat => Number(cat.id) === categorieId);
  const displayValue = selectedCategory ? selectedCategory.nom : "";

  return (
    <FormField
      control={form.control}
      name="categorie_id"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Catégorie*
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détectée)
              </span>
            )}
          </FormLabel>
          
          <CategorySelector 
            value={field.value}
            onChange={handleCategorySelect}
            categories={categories}
            displayValue={displayValue}
            loadingCategories={loadingCategories}
            disabled={loading}
            onOpenAddDialog={() => setAddDialogOpen(true)}
          />
          
          <AddCategoryDialog 
            open={addDialogOpen}
            onOpenChange={setAddDialogOpen}
            onCategoryAdded={handleCategorySelect}
            onCategoriesChange={onCategoriesChange}
          />
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorieField;
