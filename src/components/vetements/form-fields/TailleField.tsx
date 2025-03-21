
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une taille" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
              <SelectItem value="36">36</SelectItem>
              <SelectItem value="38">38</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="42">42</SelectItem>
              <SelectItem value="44">44</SelectItem>
              <SelectItem value="46">46</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TailleField;
