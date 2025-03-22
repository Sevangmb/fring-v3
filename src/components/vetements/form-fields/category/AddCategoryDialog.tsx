
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Categorie } from "@/services/categorieService";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCategory: (categoryName: string) => Promise<Categorie | void>;
  addingCategory: boolean;
}

export const AddCategoryDialog: React.FC<AddCategoryDialogProps> = ({
  open,
  onOpenChange,
  onAddCategory,
  addingCategory
}) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("Le nom de la catégorie est requis");
      return;
    }

    setError("");

    try {
      await onAddCategory(categoryName.trim());
      setCategoryName("");
    } catch (err) {
      console.error("Erreur lors de l'ajout de la catégorie:", err);
      setError("Une erreur est survenue lors de l'ajout de la catégorie");
    }
  };

  const handleClose = () => {
    setCategoryName("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="categoryName">Nom de la catégorie</Label>
            <Input
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Entrez le nom de la catégorie"
              disabled={addingCategory}
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={addingCategory}>
            Annuler
          </Button>
          <Button onClick={handleAddCategory} disabled={addingCategory || !categoryName.trim()}>
            {addingCategory ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              "Ajouter"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
