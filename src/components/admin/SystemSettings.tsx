
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";

const SystemSettings = () => {
  const { toast } = useToast();
  const form = useForm({
    defaultValues: {
      siteName: "Fring App",
      siteUrl: "https://fring.app",
      adminEmail: "admin@fring.app",
      enableRegistration: true,
      requireEmailVerification: true,
      maxFileSize: 5,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    toast({
      title: "Paramètres mis à jour",
      description: "Les paramètres du système ont été mis à jour avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Paramètres du système</h2>
        <Button type="submit" form="settings-form">
          Enregistrer les modifications
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="storage">Stockage</TabsTrigger>
        </TabsList>
        
        <Form {...form}>
          <form id="settings-form" onSubmit={form.handleSubmit(onSubmit)}>
            <TabsContent value="general" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="siteName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du site</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Le nom qui apparaîtra dans les titres et l'interface
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="siteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL du site</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      L'adresse URL principale du site
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adminEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email de l'administrateur</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      L'adresse email principale pour les notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="enableRegistration"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Activer l'inscription
                      </FormLabel>
                      <FormDescription>
                        Permettre aux nouveaux utilisateurs de s'inscrire
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
              
              <FormField
                control={form.control}
                name="requireEmailVerification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Exiger la vérification par email
                      </FormLabel>
                      <FormDescription>
                        Les utilisateurs doivent vérifier leur adresse email
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
            </TabsContent>
            
            <TabsContent value="storage" className="space-y-4 mt-4">
              <FormField
                control={form.control}
                name="maxFileSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taille maximale des fichiers (MB)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Taille maximale des fichiers pouvant être téléchargés
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </form>
        </Form>
      </Tabs>
    </div>
  );
};

export default SystemSettings;
