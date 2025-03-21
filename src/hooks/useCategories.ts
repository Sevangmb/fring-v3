
import { useState, useCallback, useEffect } from "react";
import { Categorie } from "@/components/vetements/schema/VetementFormSchema";
import { addCategorie, fetchCategories } from "@/services/categorieService";
import { useToast } from "@/hooks/use-toast";

interface UseCategoriesProps {
  initialCategories?: Categorie[];
  onCategoryAdded?: (categoryId: number) => void;
  onCategoriesChange?: () => void;
}

export const useCategories = ({
  initialCategories = [],
  onCategoryAdded,
  onCategoriesChange
}: UseCategoriesProps = {}) => {
  const [categories, setCategories] = useState<Categorie[]>(initialCategories || []);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { toast } = useToast();

  // Charger les catégories depuis Supabase
  const loadCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      const categoriesData = await fetchCategories();
      setCategories(categoriesData || []);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les catégories",
        variant: "destructive"
      });
      // Ensure categories is at least an empty array on error
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [toast]);

  // Charger les catégories au montage du composant
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const openAddDialog = useCallback(() => {
    setAddDialogOpen(true);
  }, []);

  const closeAddDialog = useCallback(() => {
    setAddDialogOpen(false);
  }, []);

  const handleAddCategory = useCallback(async (categoryName: string) => {
    if (!categoryName.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCategory(true);
      const newCategory = await addCategorie({ nom: categoryName.trim() });
      
      toast({
        title: "Succès",
        description: `La catégorie ${newCategory.nom} a été ajoutée`
      });
      
      // Update local categories list safely
      setCategories((prev) => [...(prev || []), newCategory]);
      
      if (onCategoryAdded) {
        onCategoryAdded(Number(newCategory.id));
      }
      
      closeAddDialog();
      
      if (onCategoriesChange) {
        onCategoriesChange();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la catégorie",
        variant: "destructive"
      });
    } finally {
      setAddingCategory(false);
    }
  }, [toast, onCategoryAdded, onCategoriesChange, closeAddDialog]);

  return {
    categories,
    loadingCategories,
    addDialogOpen,
    addingCategory,
    openAddDialog,
    closeAddDialog,
    handleAddCategory,
    refreshCategories: loadCategories
  };
};
