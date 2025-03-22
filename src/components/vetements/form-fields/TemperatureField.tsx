
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues, temperatureOptions } from "../schema/VetementFormSchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Thermometer, ThermometerSnowflake, ThermometerSun } from "lucide-react";

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
  
  // Obtenir la valeur actuelle pour l'afficher dans le label si elle existe
  const temperatureValue = form.watch('temperature');
  const hasDetectedValue = !!temperatureValue;
  
  return (
    <FormField
      control={form.control}
      name="temperature"
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>
            Température idéale
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détecté)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value || ''}
              className="flex flex-col space-y-1"
            >
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="froid" id="froid" />
                  <Label htmlFor="froid" className="flex items-center">
                    <ThermometerSnowflake className="w-4 h-4 mr-1.5 text-blue-500" />
                    Froid
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tempere" id="tempere" />
                  <Label htmlFor="tempere" className="flex items-center">
                    <Thermometer className="w-4 h-4 mr-1.5 text-purple-500" />
                    Tempéré
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="chaud" id="chaud" />
                  <Label htmlFor="chaud" className="flex items-center">
                    <ThermometerSun className="w-4 h-4 mr-1.5 text-orange-500" />
                    Chaud
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

export default TemperatureField;
