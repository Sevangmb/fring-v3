
import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { Categorie } from "../../schema/VetementFormSchema";
import { cn } from "@/lib/utils";
import { AddCategoryCommand } from "./AddCategoryCommand";

interface CategorySelectorProps {
  value: number | null;
  onChange: (value: number) => void;
  categories: Categorie[];
  displayValue: string;
  loadingCategories: boolean;
  disabled?: boolean;
  onOpenAddDialog: () => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  categories,
  displayValue,
  loadingCategories,
  disabled = false,
  onOpenAddDialog
}) => {
  const [open, setOpen] = useState(false);

  const handleCategorySelect = (categoryId: number) => {
    onChange(categoryId);
    setOpen(false);
  };

  return (
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
            disabled={disabled}
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
          {!loadingCategories && categories && categories.length > 0 ? (
            <CommandGroup className="max-h-64 overflow-auto">
              {categories.map((category) => (
                <CommandItem
                  key={String(category.id)}
                  value={String(category.nom)}
                  onSelect={() => handleCategorySelect(Number(category.id))}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === Number(category.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {category.nom}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              {loadingCategories ? "Chargement des catégories..." : "Aucune catégorie disponible"}
            </div>
          )}
          <CommandSeparator />
          <CommandGroup>
            <AddCategoryCommand onAddCategory={onOpenAddDialog} />
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
