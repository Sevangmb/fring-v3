
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddCategory = async () => {
    if (!newCategoryValue.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onAddCategory(newCategoryValue);
      setNewCategoryValue('');
    } finally {
      setIsSubmitting(false);
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
            disabled={isSubmitting || addingCategory}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleAddCategory}
            disabled={isSubmitting || addingCategory || !newCategoryValue.trim()}
          >
            {isSubmitting || addingCategory ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
