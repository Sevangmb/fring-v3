
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { fetchCategories, addCategorie, Categorie } from "@/services/categorieService";

interface UseCategoriesProps {
  initialCategories?: Categorie[];
  onCategoryAdded?: (categoryId: number) => void;
  onCategoriesChange?: () => void;
}

export const useCategories = (props: UseCategoriesProps = {}) => {
  const { initialCategories = [], onCategoryAdded, onCategoriesChange } = props;
  const [categories, setCategories] = useState<Categorie[]>(initialCategories);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [addingCategory, setAddingCategory] = useState<boolean>(false);

  const fetchAllCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const fetchedCategories = await fetchCategories();
      console.log("Catégories récupérées:", fetchedCategories);
      setCategories(fetchedCategories);
      
      if (onCategoriesChange) {
        onCategoriesChange();
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    } finally {
      setLoadingCategories(false);
    }
  }, [onCategoriesChange]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const openAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const handleAddCategory = useCallback(async (categoryName: string) => {
    try {
      setAddingCategory(true);
      const newCategory = await addCategorie({ nom: categoryName });
      console.log("Nouvelle catégorie ajoutée:", newCategory);
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setAddDialogOpen(false);
      
      if (onCategoryAdded) {
        onCategoryAdded(Number(newCategory.id));
      }
      
      if (onCategoriesChange) {
        onCategoriesChange();
      }
      
      return newCategory;
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      throw error;
    } finally {
      setAddingCategory(false);
    }
  }, [onCategoryAdded, onCategoriesChange]);

  return {
    categories,
    loadingCategories,
    addDialogOpen,
    addingCategory,
    openAddDialog,
    closeAddDialog,
    handleAddCategory,
    refreshCategories: fetchAllCategories
  };
};
