
import React from 'react';
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

interface Categorie {
  id: number;
  nom: string;
  description: string | null;
}

interface AdminCategorieDialogProps {
  open: boolean;
  onOpenChange: (shouldRefresh: boolean) => void;
  categorie: Categorie | null;
}

const categoryFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().nullable().optional(),
});

type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const AdminCategorieDialog: React.FC<AdminCategorieDialogProps> = ({
  open,
  onOpenChange,
  categorie
}) => {
  const { toast } = useToast();
  const isEditMode = !!categorie;
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      nom: categorie?.nom || '',
      description: categorie?.description || '',
    }
  });
  
  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('categories')
          .update({
            nom: values.nom,
            description: values.description
          })
          .eq('id', categorie.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Catégorie mise à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({
            nom: values.nom,
            description: values.description
          });
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Nouvelle catégorie ajoutée avec succès",
        });
      }
      
      onOpenChange(true);
    } catch (error) {
      console.error('Erreur lors de la gestion de la catégorie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la catégorie",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
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
                    <Input {...field} placeholder="Nom de la catégorie" />
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
                      placeholder="Description de la catégorie" 
                      value={field.value || ''}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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

export default AdminCategorieDialog;
