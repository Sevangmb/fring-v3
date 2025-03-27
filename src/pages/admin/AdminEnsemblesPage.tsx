
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { Text } from '@/components/atoms/Typography';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminEnsemblesPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Gestion des ensembles" 
      description="Gérez les ensembles et les suggestions."
    >
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <ShoppingBag className="h-8 w-8 text-primary" />
        </div>
        <Text>
          Fonctionnalité en cours de développement. Cette section permettra de gérer les ensembles, 
          les tenues suggérées et les recommandations.
        </Text>
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminEnsemblesPage;
