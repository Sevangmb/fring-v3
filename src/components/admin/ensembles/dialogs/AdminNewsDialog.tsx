
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { News } from '@/hooks/admin/useNewsList';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  title: z.string().min(2, 'Le titre doit contenir au moins 2 caractères').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
  date: z.string().min(2, 'La date doit être valide'),
  content: z.string().min(10, 'Le contenu doit contenir au moins 10 caractères')
});

type FormValues = z.infer<typeof formSchema>;

interface AdminNewsDialogProps {
  open: boolean;
  onOpenChange: (refresh: boolean) => void;
  news: News | null;
}

const AdminNewsDialog: React.FC<AdminNewsDialogProps> = ({ 
  open, 
  onOpenChange, 
  news 
}) => {
  const { toast } = useToast();
  const isEditMode = !!news;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: news?.title || '',
      date: news?.date || format(new Date(), 'dd MMMM yyyy', { locale: fr }),
      content: news?.content || ''
    }
  });

  // Mettre à jour les valeurs du formulaire lorsque la news change
  React.useEffect(() => {
    if (news) {
      form.reset({
        title: news.title,
        date: news.date,
        content: news.content
      });
    } else {
      form.reset({
        title: '',
        date: format(new Date(), 'dd MMMM yyyy', { locale: fr }),
        content: ''
      });
    }
  }, [news, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEditMode) {
        // Mise à jour d'une actualité existante
        const { error } = await supabase
          .from('news')
          .update({
            title: values.title,
            date: values.date,
            content: values.content
          })
          .eq('id', news.id);

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Actualité mise à jour avec succès"
        });
      } else {
        // Création d'une nouvelle actualité
        const { error } = await supabase
          .from('news')
          .insert({
            title: values.title,
            date: values.date,
            content: values.content
          });

        if (error) throw error;

        toast({
          title: "Succès",
          description: "Actualité ajoutée avec succès"
        });
      }

      onOpenChange(true); // Fermer le dialogue et rafraîchir la liste
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de l\'actualité:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer l'actualité",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modifier l\'actualité' : 'Ajouter une actualité'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'actualité" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input placeholder="Date d'affichage (ex: 15 juin 2023)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contenu</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Contenu de l'actualité" 
                      className="min-h-[120px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                {isEditMode ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminNewsDialog;
