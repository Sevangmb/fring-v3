
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { defiFormSchema, DefiFormValues, validateDateRange } from "./schema/DefiFormSchema";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface DefiFormProps {
  onClose?: () => void;
  initialValues?: Partial<DefiFormValues>;
}

const DefiForm: React.FC<DefiFormProps> = ({ onClose, initialValues }) => {
  const [dateRangeError, setDateRangeError] = React.useState<string | null>(null);
  const [submissionError, setSubmissionError] = React.useState<string | null>(null);
  
  // Configuration du formulaire avec validation Zod
  const form = useForm<DefiFormValues>({
    resolver: zodResolver(defiFormSchema),
    defaultValues: {
      titre: initialValues?.titre || "",
      description: initialValues?.description || "",
      dateDebut: initialValues?.dateDebut || "",
      dateFin: initialValues?.dateFin || ""
    }
  });
  
  const onSubmit = async (data: DefiFormValues) => {
    try {
      // Reset errors
      setSubmissionError(null);
      setDateRangeError(null);
      
      // Validate date range
      const dateValidation = validateDateRange(data);
      if (!dateValidation.success) {
        setDateRangeError(dateValidation.error);
        return;
      }
      
      console.log("Formulaire soumis:", data);
      
      // Here you would add the actual API call to save the defi
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Défi créé",
        description: "Votre défi a été créé avec succès.",
      });
      
      // Réinitialiser le formulaire
      form.reset();
      if (onClose) onClose();
    } catch (error) {
      console.error("Erreur lors de la création du défi:", error);
      setSubmissionError("Une erreur est survenue lors de la création du défi. Veuillez réessayer.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {submissionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}
        
        <FormField
          control={form.control}
          name="titre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du défi</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrez un titre accrocheur" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  {...field} 
                  placeholder="Décrivez votre défi" 
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dateDebut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    min={new Date().toISOString().split('T')[0]} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dateFin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    min={form.watch('dateDebut') || new Date().toISOString().split('T')[0]} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {dateRangeError && (
          <p className="text-sm font-medium text-destructive">{dateRangeError}</p>
        )}
        
        <DialogFooter>
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="w-full sm:w-auto"
          >
            {form.formState.isSubmitting ? "Création en cours..." : "Créer le défi"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DefiForm;
