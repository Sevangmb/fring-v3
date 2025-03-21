
import React from "react";
import { CommandItem } from "@/components/ui/command";
import { PlusCircle } from "lucide-react";

interface AddCategoryCommandProps {
  onAddCategory: () => void;
}

export const AddCategoryCommand: React.FC<AddCategoryCommandProps> = ({ onAddCategory }) => {
  return (
    <CommandItem
      className="text-primary"
      onSelect={onAddCategory}
    >
      <PlusCircle className="mr-2 h-4 w-4" />
      Ajouter une nouvelle catégorie
    </CommandItem>
  );
};
