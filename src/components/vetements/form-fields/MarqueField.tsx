
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, Marque } from "../schema/VetementFormSchema";

interface MarqueFieldProps {
  form: UseFormReturn<VetementFormValues>;
  marques: Marque[];
}

const MarqueField: React.FC<MarqueFieldProps> = ({ form, marques }) => {
  return (
    <FormField
      control={form.control}
      name="marque"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Marque</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value || "none"}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une marque (optionnel)" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="none">Aucune marque</SelectItem>
              {marques.length > 0 ? (
                marques.map((marque) => (
                  <SelectItem key={marque.id} value={marque.nom}>
                    {marque.nom}
                  </SelectItem>
                ))
              ) : (
                <>
                  <SelectItem value="Nike">Nike</SelectItem>
                  <SelectItem value="Adidas">Adidas</SelectItem>
                  <SelectItem value="Zara">Zara</SelectItem>
                  <SelectItem value="H&M">H&M</SelectItem>
                  <SelectItem value="Levi's">Levi's</SelectItem>
                  <SelectItem value="Uniqlo">Uniqlo</SelectItem>
                  <SelectItem value="Gap">Gap</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
          <FormDescription>Optionnel</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MarqueField;
