
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import Input from "@/components/atoms/Input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";

// Type pour le formulaire de création de défi
export type DefiFormValues = {
  titre: string;
  description: string;
  dateDebut: string;
  dateFin: string;
};

const DefiForm = ({ onClose }: { onClose?: () => void }) => {
  // Configuration du formulaire pour créer un défi
  const form = useForm<DefiFormValues>({
    defaultValues: {
      titre: "",
      description: "",
      dateDebut: "",
      dateFin: ""
    }
  });
  
  const onSubmit = (data: DefiFormValues) => {
    console.log("Formulaire soumis:", data);
    toast({
      title: "Défi créé",
      description: "Votre défi a été créé avec succès.",
    });
    // Réinitialiser le formulaire
    form.reset();
    if (onClose) onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <Input {...field} placeholder="Décrivez votre défi" />
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
                  <Input type="date" {...field} />
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
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <DialogFooter>
          <Button type="submit">Créer le défi</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default DefiForm;
