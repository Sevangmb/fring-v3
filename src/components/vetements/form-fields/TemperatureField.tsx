
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, temperatureOptions } from "../schema/VetementFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TemperatureFieldProps {
  form: UseFormReturn<VetementFormValues>;
}

const TemperatureField: React.FC<TemperatureFieldProps> = ({ form }) => {
  // Pour observer et déboguer le champ temperature
  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Temperature value:", value.temperature);
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  return (
    <FormField
      control={form.control}
      name="temperature"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Température idéale</FormLabel>
          <FormControl>
            <Select
              value={field.value || "none"}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une température" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Non spécifiée</SelectItem>
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

export default TemperatureField;
