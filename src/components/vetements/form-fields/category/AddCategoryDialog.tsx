
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { addCategorie } from "@/services/categorieService";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoryAdded: (categoryId: number) => void;
  onCategoriesChange?: () => void;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onCategoryAdded,
  onCategoriesChange
}) => {
  const [newCategoryValue, setNewCategoryValue] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategoryValue.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCategory(true);
      const newCategory = await addCategorie({ nom: newCategoryValue.trim() });
      
      toast({
        title: "Succès",
        description: `La catégorie ${newCategory.nom} a été ajoutée`
      });
      
      onCategoryAdded(Number(newCategory.id));
      onOpenChange(false);
      setNewCategoryValue('');
      
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
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
          <DialogDescription>
            Entrez le nom de la nouvelle catégorie de vêtement.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Nom de la catégorie"
          value={newCategoryValue}
          onChange={(e) => setNewCategoryValue(e.target.value)}
        />
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={addingCategory}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddCategory}
            disabled={addingCategory || !newCategoryValue.trim()}
          >
            {addingCategory ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
