
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

interface Marque {
  id: number;
  nom: string;
  logo_url: string | null;
  site_web: string | null;
}

interface AdminMarqueDialogProps {
  open: boolean;
  onOpenChange: (shouldRefresh: boolean) => void;
  marque: Marque | null;
}

const marqueFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  logo_url: z.string().url("L'URL du logo n'est pas valide").nullable().optional(),
  site_web: z.string().url("L'URL du site web n'est pas valide").nullable().optional(),
});

type MarqueFormValues = z.infer<typeof marqueFormSchema>;

const AdminMarqueDialog: React.FC<AdminMarqueDialogProps> = ({
  open,
  onOpenChange,
  marque
}) => {
  const { toast } = useToast();
  const isEditMode = !!marque;
  
  const form = useForm<MarqueFormValues>({
    resolver: zodResolver(marqueFormSchema),
    defaultValues: {
      nom: marque?.nom || '',
      logo_url: marque?.logo_url || '',
      site_web: marque?.site_web || '',
    }
  });
  
  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: MarqueFormValues) => {
    try {
      if (isEditMode) {
        const { error } = await supabase
          .from('marques')
          .update({
            nom: values.nom,
            logo_url: values.logo_url || null,
            site_web: values.site_web || null
          })
          .eq('id', marque.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Marque mise à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('marques')
          .insert({
            nom: values.nom,
            logo_url: values.logo_url || null,
            site_web: values.site_web || null
          });
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Nouvelle marque ajoutée avec succès",
        });
      }
      
      onOpenChange(true);
    } catch (error) {
      console.error('Erreur lors de la gestion de la marque:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la marque",
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
            {isEditMode ? 'Modifier la marque' : 'Ajouter une marque'}
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
                    <Input {...field} placeholder="Nom de la marque" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="logo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL du logo</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://exemple.com/logo.png" 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="site_web"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site web</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://exemple.com" 
                      value={field.value || ''}
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

export default AdminMarqueDialog;
