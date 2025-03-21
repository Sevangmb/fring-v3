
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";

interface TailleFieldProps {
  form: UseFormReturn<VetementFormValues>;
}

const TailleField: React.FC<TailleFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="taille"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Taille*</FormLabel>
          <FormControl>
            <Input placeholder="Entrez la taille (ex: M, L, XL, 40, 42)" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TailleField;
