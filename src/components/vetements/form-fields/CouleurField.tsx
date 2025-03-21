
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { VetementFormValues } from "../schema/VetementFormSchema";

interface CouleurFieldProps {
  form: UseFormReturn<VetementFormValues>;
  loading: boolean;
}

const CouleurField: React.FC<CouleurFieldProps> = ({ form, loading }) => {
  // Récupérer la valeur actuelle pour l'afficher dans le label si elle existe
  const couleurValue = form.watch('couleur');
  const hasDetectedValue = !!couleurValue && !loading;
  
  return (
    <FormField
      control={form.control}
      name="couleur"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Couleur*
            {hasDetectedValue && (
              <span className="ml-2 text-primary font-normal">
                (Détectée)
              </span>
            )}
          </FormLabel>
          <FormControl>
            <Input 
              placeholder={loading ? "Détection en cours..." : "Entrez la couleur"} 
              value={field.value || ""}
              onChange={(e) => {
                console.log("Couleur changée:", e.target.value);
                field.onChange(e.target.value);
              }}
              onBlur={field.onBlur}
              name={field.name}
              disabled={loading}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CouleurField;
