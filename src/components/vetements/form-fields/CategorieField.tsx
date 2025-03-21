
import React, { useEffect, useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Categorie } from "../schema/VetementFormSchema";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CategorieFieldProps {
  form: UseFormReturn<VetementFormValues>;
  categories: Categorie[];
  loadingCategories: boolean;
  loading: boolean;
}

const CategorieField: React.FC<CategorieFieldProps> = ({ 
  form, 
  categories, 
  loadingCategories,
  loading
}) => {
  // Récupérer la valeur actuelle pour l'afficher dans le label si elle existe
  const categorieValue = form.watch('categorie');
  const categorieIdValue = form.watch('categorie_id');
  const hasDetectedValue = !!categorieValue && !loading;
  const [open, setOpen] = useState(false);

  // Fonction pour mettre à jour la catégorie sélectionnée
  const handleCategorySelect = (value: string, categoryId?: number) => {
    form.setValue('categorie', value);
    if (categoryId) {
      form.setValue('categorie_id', categoryId);
    }
    setOpen(false);
  };

  // Si un ID de catégorie est défini mais pas le nom, récupérer le nom
  useEffect(() => {
    if (categorieIdValue && !categorieValue && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === categorieIdValue);
      if (selectedCategory) {
        form.setValue('categorie', selectedCategory.nom);
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
                <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {!loadingCategories && categories.map((category) => (
                    <CommandItem
                      key={category.id}
                      value={category.nom}
                      onSelect={() => handleCategorySelect(category.nom, category.id as number)}
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
