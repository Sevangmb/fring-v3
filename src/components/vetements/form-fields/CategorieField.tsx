
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";
import { CategorySelector } from "./category/CategorySelector";
import { AddCategoryDialog } from "./category/AddCategoryDialog";
import { useCategories } from "@/hooks/useCategories";

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

  const { 
    addDialogOpen, 
    openAddDialog, 
    closeAddDialog, 
    handleAddCategory 
  } = useCategories({
    initialCategories: categories,
    onCategoryAdded: (categoryId) => {
      form.setValue('categorie_id', categoryId, { shouldValidate: true });
    },
    onCategoriesChange
  });

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
            onChange={(categoryId) => {
              form.setValue('categorie_id', categoryId, { shouldValidate: true });
            }}
            categories={categories}
            displayValue={displayValue}
            loadingCategories={loadingCategories}
            disabled={loading}
            onOpenAddDialog={openAddDialog}
          />
          
          <AddCategoryDialog 
            open={addDialogOpen}
            onOpenChange={closeAddDialog}
            onAddCategory={handleAddCategory}
            addingCategory={false}
          />
          
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorieField;
