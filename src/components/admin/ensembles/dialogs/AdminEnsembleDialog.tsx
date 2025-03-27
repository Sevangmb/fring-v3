
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { Ensemble } from '@/services/ensemble/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminEnsembleDialogProps {
  open: boolean;
  onOpenChange: (shouldRefresh: boolean) => void;
  ensemble: Ensemble | null;
}

const ensembleFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().nullable().optional(),
  occasion: z.string().nullable().optional(),
  saison: z.string().nullable().optional(),
});

type EnsembleFormValues = z.infer<typeof ensembleFormSchema>;

const AdminEnsembleDialog: React.FC<AdminEnsembleDialogProps> = ({
  open,
  onOpenChange,
  ensemble
}) => {
  const { toast } = useToast();
  const isEditMode = !!ensemble;
  
  const form = useForm<EnsembleFormValues>({
    resolver: zodResolver(ensembleFormSchema),
    defaultValues: {
      nom: ensemble?.nom || '',
      description: ensemble?.description || '',
      occasion: ensemble?.occasion || '',
      saison: ensemble?.saison || '',
    }
  });
  
  // Mettre à jour les valeurs du formulaire lorsque l'ensemble change
  useEffect(() => {
    if (ensemble) {
      form.reset({
        nom: ensemble.nom || '',
        description: ensemble.description || '',
        occasion: ensemble.occasion || '',
        saison: ensemble.saison || '',
      });
    } else {
      form.reset({
        nom: '',
        description: '',
        occasion: '',
        saison: '',
      });
    }
  }, [ensemble, form]);
  
  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: EnsembleFormValues) => {
    try {
      if (isEditMode && ensemble) {
        const { error } = await supabase
          .from('tenues')
          .update({
            nom: values.nom,
            description: values.description,
            occasion: values.occasion,
            saison: values.saison
          })
          .eq('id', ensemble.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Ensemble mis à jour avec succès",
        });
      } else {
        const { data: sessionData } = await supabase.auth.getSession();
        const userId = sessionData.session?.user?.id;
        
        const { error } = await supabase
          .from('tenues')
          .insert({
            nom: values.nom,
            description: values.description,
            occasion: values.occasion,
            saison: values.saison,
            user_id: userId
          });
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Nouvel ensemble ajouté avec succès",
        });
      }
      
      onOpenChange(true);
    } catch (error) {
      console.error('Erreur lors de la gestion de l\'ensemble:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ensemble",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };
  
  const seasons = ["Printemps", "Été", "Automne", "Hiver", "Toutes saisons"];
  const occasions = ["Casual", "Formel", "Sport", "Soirée", "Bureau", "Vacances"];

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier l\'ensemble' : 'Ajouter un ensemble'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom*</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nom de l'ensemble" />
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
                      placeholder="Description de l'ensemble" 
                      value={field.value || ''}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="saison"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Saison</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une saison" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Aucune</SelectItem>
                        {seasons.map(season => (
                          <SelectItem key={season} value={season}>
                            {season}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="occasion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occasion</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value || ''}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une occasion" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Aucune</SelectItem>
                        {occasions.map(occasion => (
                          <SelectItem key={occasion} value={occasion}>
                            {occasion}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="mt-6 gap-2">
              <Button type="button" variant="outline" onClick={handleCancel}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  isEditMode ? 'Mettre à jour' : 'Ajouter'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminEnsembleDialog;
