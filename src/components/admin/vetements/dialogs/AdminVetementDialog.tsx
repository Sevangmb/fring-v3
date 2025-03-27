
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Vetement } from '@/services/vetement/types';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface AdminVetementDialogProps {
  open: boolean;
  onOpenChange: (shouldRefresh: boolean) => void;
  vetement: Vetement | null;
  categories: { id: number; nom: string; }[];
}

const vetementFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().nullable().optional(),
  categorie_id: z.coerce.number().min(1, "Veuillez sélectionner une catégorie"),
  taille: z.string().min(1, "La taille est requise"),
  couleur: z.string().min(1, "La couleur est requise"),
  marque: z.string().nullable().optional(),
  image_url: z.string().url("L'URL de l'image n'est pas valide").nullable().optional(),
  temperature: z.enum(["froid", "tempere", "chaud"]).nullable().optional(),
  weatherType: z.enum(["pluie", "neige", "normal"]).nullable().optional(),
  user_id: z.string().uuid().nullable().optional(),
});

type VetementFormValues = z.infer<typeof vetementFormSchema>;

const AdminVetementDialog: React.FC<AdminVetementDialogProps> = ({
  open,
  onOpenChange,
  vetement,
  categories
}) => {
  const { toast } = useToast();
  const isEditMode = !!vetement;
  const [users, setUsers] = useState<{ id: string; email: string }[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  
  const form = useForm<VetementFormValues>({
    resolver: zodResolver(vetementFormSchema),
    defaultValues: {
      nom: vetement?.nom || '',
      description: vetement?.description || '',
      categorie_id: vetement?.categorie_id || 0,
      taille: vetement?.taille || '',
      couleur: vetement?.couleur || '',
      marque: vetement?.marque || '',
      image_url: vetement?.image_url || '',
      temperature: (vetement?.temperature as any) || null,
      weatherType: (vetement?.weatherType as any) || null,
      user_id: vetement?.user_id || null,
    }
  });
  
  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    if (isEditMode && vetement) {
      Object.entries(vetement).forEach(([key, value]) => {
        if (value !== undefined && key in form.getValues()) {
          form.setValue(key as any, value === null ? '' : value);
        }
      });
    }
  }, [vetement, form, isEditMode]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase.rpc('search_admin_users', {
        search_term: ''
      });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const onSubmit = async (values: VetementFormValues) => {
    try {
      const formattedValues = {
        ...values,
        description: values.description || null,
        marque: values.marque || null,
        image_url: values.image_url || null,
        temperature: values.temperature || null,
        weatherType: values.weatherType || null,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('vetements')
          .update(formattedValues)
          .eq('id', vetement!.id);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Vêtement mis à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('vetements')
          .insert(formattedValues);
        
        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Nouveau vêtement ajouté avec succès",
        });
      }
      
      onOpenChange(true);
    } catch (error) {
      console.error('Erreur lors de la gestion du vêtement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le vêtement",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier le vêtement' : 'Ajouter un vêtement'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nom du vêtement" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categorie_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catégorie*</FormLabel>
                    <Select 
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value ? String(field.value) : undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.id} 
                            value={String(category.id)}
                          >
                            {category.nom}
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
                name="couleur"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couleur*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Couleur" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taille"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille*</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Taille (ex: M, L, 42)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="marque"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="Marque" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="https://exemple.com/image.jpg" 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Température</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une température" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="froid">Froid</SelectItem>
                        <SelectItem value="tempere">Tempéré</SelectItem>
                        <SelectItem value="chaud">Chaud</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="weatherType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de météo</FormLabel>
                    <Select 
                      onValueChange={field.onChange}
                      defaultValue={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type de météo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="pluie">Pluie</SelectItem>
                        <SelectItem value="neige">Neige</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Description du vêtement" 
                      value={field.value || ''}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="user_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propriétaire</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value || undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un propriétaire" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Non assigné</SelectItem>
                      {loadingUsers ? (
                        <SelectItem value="" disabled>
                          Chargement des utilisateurs...
                        </SelectItem>
                      ) : (
                        users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
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

export default AdminVetementDialog;
