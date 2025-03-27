
import React, { useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminVetementsCategories from '@/components/admin/vetements/AdminVetementsCategories';
import AdminVetementsList from '@/components/admin/vetements/AdminVetementsList';
import AdminMarques from '@/components/admin/vetements/AdminMarques';

const AdminVetementsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('vetements');
  
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
      title="Gestion des vêtements" 
      description="Gérez le catalogue de vêtements, les catégories et les marques."
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="vetements">Vêtements</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="marques">Marques</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vetements">
          <AdminVetementsList />
        </TabsContent>
        
        <TabsContent value="categories">
          <AdminVetementsCategories />
        </TabsContent>
        
        <TabsContent value="marques">
          <AdminMarques />
        </TabsContent>
      </Tabs>
    </AdminModuleTemplate>
  );
};

export default AdminVetementsPage;
