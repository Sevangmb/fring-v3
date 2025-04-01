
import React, { useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEnsemblesList from '@/components/admin/ensembles/AdminEnsemblesList';
import AdminRecommandations from '@/components/admin/ensembles/AdminRecommandations';
import AdminTenuesSuggestions from '@/components/admin/ensembles/AdminTenuesSuggestions';
import AdminNews from '@/components/admin/ensembles/AdminNews';

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
      description="Administrez les ensembles de vêtements, les suggestions personnalisées et les actualités."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="ensembles">Ensembles</TabsTrigger>
          <TabsTrigger value="recommandations">Recommandations</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="news">Actualités</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ensembles">
          <AdminEnsemblesList />
        </TabsContent>
        
        <TabsContent value="recommandations">
          <AdminRecommandations />
        </TabsContent>
        
        <TabsContent value="suggestions">
          <AdminTenuesSuggestions />
        </TabsContent>
        
        <TabsContent value="news">
          <AdminNews />
        </TabsContent>
      </Tabs>
    </AdminModuleTemplate>
  );
};

export default AdminEnsemblesPage;
