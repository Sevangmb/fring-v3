
import React, { useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, temperatureOptions } from "../schema/VetementFormSchema";

interface TemperatureFieldProps {
  form: UseFormReturn<VetementFormValues>;
  autoDetect?: boolean;
}

const TemperatureField: React.FC<TemperatureFieldProps> = ({ form, autoDetect = true }) => {
  const categorieValue = form.watch('categorie');
  const currentTemperature = form.watch('temperature');
  
  // Auto-detect temperature based on clothing category if not already set
  useEffect(() => {
    if (autoDetect && categorieValue && !currentTemperature) {
      const temperature = determineTemperatureFromCategory(categorieValue);
      if (temperature) {
        console.log("Auto-détection de la température:", temperature);
        form.setValue('temperature', temperature);
      }
    }
  }, [categorieValue, form, autoDetect, currentTemperature]);

  // Obtenir la valeur actuelle pour l'afficher dans le label si elle existe
  const hasDetectedValue = !!currentTemperature;

  return (
    <FormField
      control={form.control}
      name="temperature"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Température
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détectée)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Select
              value={field.value || ""}
              onValueChange={(value) => {
                console.log("Température changée:", value);
                field.onChange(value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir une température" />
              </SelectTrigger>
              <SelectContent>
                {temperatureOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Fonction pour déterminer la température en fonction de la catégorie
export const determineTemperatureFromCategory = (categorie: string): "froid" | "tempere" | "chaud" | undefined => {
  // Liste des vêtements pour temps froid
  const coldItems = [
    "pull", "pullover", "sweat", "sweatshirt", "hoodie", "manteau", "veste", "jacket", 
    "coat", "blouson", "doudoune", "parka", "anorak", "cardigan", "écharpe", "bonnet", 
    "gants", "pull-over"
  ];
  
  // Liste des vêtements pour temps chaud
  const hotItems = [
    "short", "shorts", "t-shirt", "tank", "débardeur", "debardeur", "maillot", 
    "crop top", "swimsuit", "maillot de bain", "bikini", "sandales", "claquettes", 
    "tongs", "bermuda"
  ];
  
  // Vérifier si la catégorie contient un des mots-clés
  const categorieLC = categorie.toLowerCase();
  
  for (const item of coldItems) {
    if (categorieLC.includes(item)) {
      return "froid";
    }
  }
  
  for (const item of hotItems) {
    if (categorieLC.includes(item)) {
      return "chaud";
    }
  }
  
  // Par défaut, température tempérée
  return "tempere";
};

export default TemperatureField;
