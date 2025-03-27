
import React, { useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEnsemblesList from '@/components/admin/ensembles/AdminEnsemblesList';
import AdminRecommandations from '@/components/admin/ensembles/AdminRecommandations';
import AdminTenuesSuggestions from '@/components/admin/ensembles/AdminTenuesSuggestions';
import AdminUsersList from '@/components/admin/ensembles/AdminUsersList';

const AdminEnsemblesPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('ensembles');
  
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
      title="Gestion des ensembles" 
      description="Gérez les ensembles, les tenues suggérées, les recommandations et les utilisateurs."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ensembles">Ensembles</TabsTrigger>
          <TabsTrigger value="suggestions">Tenues suggérées</TabsTrigger>
          <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
          <TabsTrigger value="utilisateurs">Utilisateurs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ensembles">
          <AdminEnsemblesList />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <AdminTenuesSuggestions />
        </TabsContent>
        
        <TabsContent value="recommandations">
          <AdminRecommandations />
        </TabsContent>
        
        <TabsContent value="utilisateurs">
          <AdminUsersList />
        </TabsContent>
      </Tabs>
    </AdminModuleTemplate>
  );
};

export default AdminEnsemblesPage;
