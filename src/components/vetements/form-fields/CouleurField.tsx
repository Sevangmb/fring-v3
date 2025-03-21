
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";

interface CouleurFieldProps {
  form: UseFormReturn<VetementFormValues>;
  detectingColor: boolean;
}

const CouleurField: React.FC<CouleurFieldProps> = ({ form, detectingColor }) => {
  return (
    <FormField
      control={form.control}
      name="couleur"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Couleur*</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            value={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={detectingColor ? "Détection en cours..." : "Sélectionner une couleur"} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="blanc">Blanc</SelectItem>
              <SelectItem value="noir">Noir</SelectItem>
              <SelectItem value="gris">Gris</SelectItem>
              <SelectItem value="bleu">Bleu</SelectItem>
              <SelectItem value="rouge">Rouge</SelectItem>
              <SelectItem value="vert">Vert</SelectItem>
              <SelectItem value="jaune">Jaune</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="violet">Violet</SelectItem>
              <SelectItem value="rose">Rose</SelectItem>
              <SelectItem value="marron">Marron</SelectItem>
              <SelectItem value="beige">Beige</SelectItem>
              <SelectItem value="multicolore">Multicolore</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CouleurField;
