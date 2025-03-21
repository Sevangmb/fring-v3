
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addCategorie } from "@/services/categorieService";
import { useToast } from "@/hooks/use-toast";

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
  const [open, setOpen] = useState(false);
  const [newCategorieValue, setNewCategorieValue] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const { toast } = useToast();

  // Fonction pour mettre à jour la catégorie sélectionnée
  const handleCategorySelect = (categoryId: number) => {
    form.setValue('categorie_id', categoryId, { shouldValidate: true });
    setOpen(false);
  };

  // Fonction pour ajouter une nouvelle catégorie
  const handleAddCategory = async () => {
    if (!newCategorieValue.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom de la catégorie ne peut pas être vide",
        variant: "destructive"
      });
      return;
    }

    try {
      setAddingCategory(true);
      const newCategory = await addCategorie({ nom: newCategorieValue.trim() });
      
      toast({
        title: "Succès",
        description: `La catégorie ${newCategory.nom} a été ajoutée`
      });
      
      // Mettre à jour le formulaire avec la nouvelle catégorie
      form.setValue('categorie_id', Number(newCategory.id), { shouldValidate: true });
      
      // Fermer le dialogue
      setAddDialogOpen(false);
      setNewCategorieValue('');
      
      // Informer le parent que les catégories ont changé
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

  // Trouver le nom de la catégorie actuellement sélectionnée
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
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    !displayValue && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  {displayValue || "Sélectionner une catégorie"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Rechercher une catégorie..." />
                <CommandEmpty>
                  <p className="py-2 px-4 text-sm text-muted-foreground">Aucune catégorie trouvée.</p>
                </CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {!loadingCategories && categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.nom}
                      onSelect={() => handleCategorySelect(Number(category.id))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === Number(category.id) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category.nom}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup>
                  <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <CommandItem className="text-primary">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Ajouter une nouvelle catégorie
                      </CommandItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle catégorie</DialogTitle>
                        <DialogDescription>
                          Entrez le nom de la nouvelle catégorie de vêtement.
                        </DialogDescription>
                      </DialogHeader>
                      <Input
                        placeholder="Nom de la catégorie"
                        value={newCategorieValue}
                        onChange={(e) => setNewCategorieValue(e.target.value)}
                      />
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setAddDialogOpen(false)}
                          disabled={addingCategory}
                        >
                          Annuler
                        </Button>
                        <Button 
                          onClick={handleAddCategory}
                          disabled={addingCategory || !newCategorieValue.trim()}
                        >
                          {addingCategory ? "Ajout en cours..." : "Ajouter"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CategorieField;
