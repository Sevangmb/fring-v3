
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  ShieldCheck, 
  Save, 
  UserCog, 
  Image, 
  Calendar, 
  MessageCircle,
  Users,
  Edit3,
  Trash2
} from 'lucide-react';
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { getAdminEmails } from '@/utils/adminUtils';

interface RolePermission {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
}

interface PermissionsFormValues {
  adminEmails: string[];
  enableStrictMode: boolean;
  enableAuditLogs: boolean;
  userRoles: {
    admin: {
      vetements: RolePermission;
      ensembles: RolePermission;
      amis: RolePermission;
      defis: RolePermission;
      messages: RolePermission;
    };
    moderator: {
      vetements: RolePermission;
      ensembles: RolePermission;
      amis: RolePermission;
      defis: RolePermission;
      messages: RolePermission;
    };
    user: {
      vetements: RolePermission;
      ensembles: RolePermission;
      amis: RolePermission;
      defis: RolePermission;
      messages: RolePermission;
    };
  };
}

const defaultPermissions: RolePermission = {
  create: true,
  read: true,
  update: true,
  delete: true
};

const restrictedPermissions: RolePermission = {
  create: true,
  read: true,
  update: true,
  delete: false
};

const readOnlyPermissions: RolePermission = {
  create: false,
  read: true,
  update: false,
  delete: false
};

const AdminPermissionsSettings: React.FC = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const adminEmails = getAdminEmails();
  
  const form = useForm<PermissionsFormValues>({
    defaultValues: {
      adminEmails,
      enableStrictMode: true,
      enableAuditLogs: true,
      userRoles: {
        admin: {
          vetements: defaultPermissions,
          ensembles: defaultPermissions,
          amis: defaultPermissions,
          defis: defaultPermissions,
          messages: defaultPermissions
        },
        moderator: {
          vetements: restrictedPermissions,
          ensembles: restrictedPermissions,
          amis: restrictedPermissions,
          defis: restrictedPermissions,
          messages: restrictedPermissions
        },
        user: {
          vetements: { ...readOnlyPermissions, create: true, update: true },
          ensembles: { ...readOnlyPermissions, create: true, update: true },
          amis: { ...readOnlyPermissions, create: true },
          defis: { ...readOnlyPermissions, create: true },
          messages: { create: true, read: true, update: false, delete: false }
        }
      }
    }
  });

  const onSubmit = async (data: PermissionsFormValues) => {
    setIsSaving(true);
    
    try {
      // Simulation d'un enregistrement des données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Paramètres des autorisations enregistrés:', data);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Les paramètres d'autorisations ont été enregistrés avec succès."
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

  const renderPermissionsTable = (role: 'admin' | 'moderator' | 'user') => {
    const roleTitle = role === 'admin' ? 'Administrateur' : role === 'moderator' ? 'Modérateur' : 'Utilisateur';
    const modules = [
      { name: 'vetements', label: 'Vêtements', icon: <Image className="h-4 w-4" /> },
      { name: 'ensembles', label: 'Ensembles', icon: <Calendar className="h-4 w-4" /> },
      { name: 'amis', label: 'Amis', icon: <Users className="h-4 w-4" /> },
      { name: 'defis', label: 'Défis', icon: <Calendar className="h-4 w-4" /> },
      { name: 'messages', label: 'Messages', icon: <MessageCircle className="h-4 w-4" /> }
    ];

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{roleTitle}</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Créer</TableHead>
              <TableHead>Lire</TableHead>
              <TableHead>Modifier</TableHead>
              <TableHead>Supprimer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.name}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {module.icon}
                    {module.label}
                  </div>
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`userRoles.${role}.${module.name}.create` as any}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={role === 'admin'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`userRoles.${role}.${module.name}.read` as any}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={role === 'admin'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`userRoles.${role}.${module.name}.update` as any}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={role === 'admin'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`userRoles.${role}.${module.name}.delete` as any}
                    render={({ field }) => (
                      <FormItem className="flex justify-center">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={role === 'admin'}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Autorisations et sécurité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configuration des administrateurs</h3>
              
              <div className="grid gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <UserCog className="h-5 w-5 text-primary" />
                    <h4 className="font-medium">Emails administrateurs</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {adminEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                        <span>{email}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline">
                      Ajouter un administrateur
                    </Button>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="enableStrictMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Mode strict</FormLabel>
                          <FormDescription>
                            Renforce les règles de sécurité pour toutes les opérations.
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
                    name="enableAuditLogs"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Journaux d'audit</FormLabel>
                          <FormDescription>
                            Enregistre toutes les actions effectuées dans l'administration.
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
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Autorisations par rôle</h3>
              
              <div className="space-y-6">
                {renderPermissionsTable('admin')}
                {renderPermissionsTable('moderator')}
                {renderPermissionsTable('user')}
              </div>
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

export default AdminPermissionsSettings;
