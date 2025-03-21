
import React, { useEffect, useState } from "react";
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
  // Récupérer la valeur actuelle pour l'afficher dans le label si elle existe
  const categorieValue = form.watch('categorie');
  const categorieIdValue = form.watch('categorie_id');
  const hasDetectedValue = !!categorieValue && !loading;
  const [open, setOpen] = useState(false);
  const [newCategorieValue, setNewCategorieValue] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const { toast } = useToast();

  // Fonction pour mettre à jour la catégorie sélectionnée
  const handleCategorySelect = (value: string, categoryId?: number) => {
    form.setValue('categorie', value, { shouldValidate: true });
    if (categoryId) {
      form.setValue('categorie_id', categoryId, { shouldValidate: true });
    } else {
      // Pas d'id ? Essayer de le trouver dans les catégories existantes
      const foundCategory = categories.find(cat => cat.nom.toLowerCase() === value.toLowerCase());
      if (foundCategory && foundCategory.id) {
        form.setValue('categorie_id', Number(foundCategory.id), { shouldValidate: true });
      } else {
        // Réinitialiser l'ID si on ne le trouve pas
        form.setValue('categorie_id', undefined, { shouldValidate: true });
      }
    }
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
      form.setValue('categorie', newCategory.nom, { shouldValidate: true });
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

  // Si un ID de catégorie est défini mais pas le nom, récupérer le nom
  useEffect(() => {
    if (categorieIdValue && (!categorieValue || categorieValue === '') && categories.length > 0) {
      const selectedCategory = categories.find(cat => Number(cat.id) === categorieIdValue);
      if (selectedCategory) {
        form.setValue('categorie', selectedCategory.nom, { shouldValidate: true });
      }
    }
  }, [categorieIdValue, categorieValue, categories, form]);

  return (
    <FormField
      control={form.control}
      name="categorie"
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
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={loading}
                >
                  {field.value || "Sélectionner une catégorie"}
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
                      onSelect={() => handleCategorySelect(category.nom, Number(category.id))}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          field.value === category.nom ? "opacity-100" : "opacity-0"
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
