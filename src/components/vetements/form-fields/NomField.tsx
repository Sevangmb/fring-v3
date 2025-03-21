
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";

interface NomFieldProps {
  form: UseFormReturn<VetementFormValues>;
}

const NomField: React.FC<NomFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="nom"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nom*</FormLabel>
          <FormControl>
            <Input placeholder="T-shirt blanc" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default NomField;
