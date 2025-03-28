
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Settings, Save, Globe, Moon, Sun } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface GeneralSettingsFormValues {
  appName: string;
  logoUrl: string;
  darkMode: boolean;
  theme: string;
  language: string;
}

const AdminGeneralSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<GeneralSettingsFormValues>({
    defaultValues: {
      appName: 'Fring',
      logoUrl: '/logo.svg',
      darkMode: false,
      theme: 'system',
      language: 'fr',
    }
  });

  const onSubmit = async (data: GeneralSettingsFormValues) => {
    setIsSaving(true);
    
    try {
      // Simulation d'un enregistrement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Paramètres généraux enregistrés:', data);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres généraux ont été enregistrés avec succès."
      });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des paramètres:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des paramètres.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Paramètres généraux
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'application</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom de l'application" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce nom sera affiché dans le titre de la page et la navigation.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du logo</FormLabel>
                    <FormControl>
                      <Input placeholder="URL du logo" {...field} />
                    </FormControl>
                    <FormDescription>
                      L'URL de l'image du logo utilisée dans l'application.
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="border rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-lg">Apparence</h3>
              
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel>Thème</FormLabel>
                    <FormControl>
                      <ToggleGroup
                        type="single"
                        value={field.value}
                        onValueChange={field.onChange}
                        className="justify-start"
                      >
                        <ToggleGroupItem value="light" aria-label="Clair">
                          <Sun className="h-4 w-4 mr-2" />
                          Clair
                        </ToggleGroupItem>
                        <ToggleGroupItem value="dark" aria-label="Sombre">
                          <Moon className="h-4 w-4 mr-2" />
                          Sombre
                        </ToggleGroupItem>
                        <ToggleGroupItem value="system" aria-label="Système">
                          <Settings className="h-4 w-4 mr-2" />
                          Système
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </FormControl>
                    <FormDescription>
                      Sélectionnez le thème par défaut de l'application.
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="darkMode"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Mode sombre automatique</FormLabel>
                      <FormDescription>
                        Activer le mode sombre automatiquement selon les préférences du système.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Langue par défaut</FormLabel>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                        <option value="es">Español</option>
                      </select>
                    </FormControl>
                  </div>
                  <FormDescription>
                    La langue par défaut pour tous les utilisateurs.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving} className="flex gap-2">
                {isSaving ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Enregistrer les paramètres
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AdminGeneralSettings;
