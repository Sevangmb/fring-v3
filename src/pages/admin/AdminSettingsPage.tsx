
import React, { useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGeneralSettings from '@/components/admin/settings/AdminGeneralSettings';
import AdminNotificationsSettings from '@/components/admin/settings/AdminNotificationsSettings';
import AdminPermissionsSettings from '@/components/admin/settings/AdminPermissionsSettings';
import AdminNewsSettings from '@/components/admin/settings/AdminNewsSettings';

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('general');
  
  // Vérification des autorisations administratives
  const authorized = isAdmin(user);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!authorized) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Configuration" 
      description="Configurez les paramètres de l'application Fring."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="permissions">Autorisations</TabsTrigger>
          <TabsTrigger value="actualites">Actualités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <AdminGeneralSettings />
        </TabsContent>
        
        <TabsContent value="notifications">
          <AdminNotificationsSettings />
        </TabsContent>
        
        <TabsContent value="permissions">
          <AdminPermissionsSettings />
        </TabsContent>
        
        <TabsContent value="actualites">
          <AdminNewsSettings />
        </TabsContent>
      </Tabs>
    </AdminModuleTemplate>
  );
};

export default AdminSettingsPage;
