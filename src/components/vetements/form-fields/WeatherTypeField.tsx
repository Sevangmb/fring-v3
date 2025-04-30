
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, weatherTypeOptions } from "../schema/VetementFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CloudRain, Snowflake, Sun } from "lucide-react";

interface WeatherTypeFieldProps {
  form: UseFormReturn<VetementFormValues>;
}

const WeatherTypeField: React.FC<WeatherTypeFieldProps> = ({ form }) => {
  // Obtenir la valeur actuelle pour l'afficher dans le label si elle existe
  const weatherTypeValue = form.watch('weather_type');
  const hasDetectedValue = !!weatherTypeValue;

  return (
    <FormField
      control={form.control}
      name="weather_type"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>
            Type de météo
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détecté)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value || 'normal'}
              className="flex flex-col space-y-1"
            >
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal" className="flex items-center">
                    <Sun className="w-4 h-4 mr-1.5 text-orange-500" />
                    Normal
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pluie" id="pluie" />
                  <Label htmlFor="pluie" className="flex items-center">
                    <CloudRain className="w-4 h-4 mr-1.5 text-blue-500" />
                    Pluie
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="neige" id="neige" />
                  <Label htmlFor="neige" className="flex items-center">
                    <Snowflake className="w-4 h-4 mr-1.5 text-sky-500" />
                    Neige
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WeatherTypeField;
