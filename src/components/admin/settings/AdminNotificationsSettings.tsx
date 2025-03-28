
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, Save, Mail, MessageCircle, User, Calendar } from 'lucide-react';
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

interface NotificationSetting {
  enabled: boolean;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

interface NotificationsFormValues {
  newFriendRequest: NotificationSetting;
  messageReceived: NotificationSetting;
  newDefi: NotificationSetting;
  defiReminder: NotificationSetting;
  systemUpdates: NotificationSetting;
}

const initialValues: NotificationsFormValues = {
  newFriendRequest: { enabled: true, email: true, push: true, inApp: true },
  messageReceived: { enabled: true, email: false, push: true, inApp: true },
  newDefi: { enabled: true, email: true, push: true, inApp: true },
  defiReminder: { enabled: true, email: true, push: true, inApp: true },
  systemUpdates: { enabled: true, email: true, push: false, inApp: true },
};

const AdminNotificationsSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<NotificationsFormValues>({
    defaultValues: initialValues
  });

  const onSubmit = async (data: NotificationsFormValues) => {
    setIsSaving(true);
    
    try {
      // Simulation d'un enregistrement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Paramètres de notifications enregistrés:', data);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres de notifications ont été enregistrés avec succès."
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

  const renderNotificationItem = (
    name: keyof NotificationsFormValues,
    title: string,
    description: string,
    icon: React.ReactNode
  ) => {
    return (
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{icon}</div>
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name={`${name}.enabled`}
            render={({ field }) => (
              <FormItem className="flex items-center space-y-0">
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
        
        {form.watch(`${name}.enabled`) && (
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name={`${name}.email`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <Mail className="h-4 w-4 inline mr-1" />
                    E-mail
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`${name}.push`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <Bell className="h-4 w-4 inline mr-1" />
                    Push
                  </FormLabel>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`${name}.inApp`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    <MessageCircle className="h-4 w-4 inline mr-1" />
                    Dans l'app
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Paramètres des notifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {renderNotificationItem(
                'newFriendRequest',
                'Demandes d\'amis',
                'Notifications pour les nouvelles demandes d\'amis.',
                <User className="h-5 w-5 text-primary" />
              )}
              
              {renderNotificationItem(
                'messageReceived',
                'Messages reçus',
                'Notifications pour les nouveaux messages.',
                <MessageCircle className="h-5 w-5 text-primary" />
              )}
              
              {renderNotificationItem(
                'newDefi',
                'Nouveaux défis',
                'Notifications pour les nouveaux défis disponibles.',
                <Calendar className="h-5 w-5 text-primary" />
              )}
              
              {renderNotificationItem(
                'defiReminder',
                'Rappels de défis',
                'Rappels pour les défis à venir ou en cours.',
                <Calendar className="h-5 w-5 text-primary" />
              )}
              
              {renderNotificationItem(
                'systemUpdates',
                'Mises à jour système',
                'Notifications pour les mises à jour importantes de l\'application.',
                <Bell className="h-5 w-5 text-primary" />
              )}
            </div>
            
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

export default AdminNotificationsSettings;
