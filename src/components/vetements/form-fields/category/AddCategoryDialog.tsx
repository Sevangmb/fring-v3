
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (categoryName: string) => Promise<void>;
  addingCategory: boolean;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onAddCategory,
  addingCategory
}) => {
  const [newCategoryValue, setNewCategoryValue] = useState('');

  const handleAddCategory = async () => {
    if (!newCategoryValue.trim()) return;
    
    try {
      await onAddCategory(newCategoryValue);
      setNewCategoryValue('');
    } catch (error) {
      console.error("Error adding category:", error);
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
