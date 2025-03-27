
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { Text } from '@/components/atoms/Typography';
import { Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminUsersPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Gestion des utilisateurs" 
      description="Gérez les comptes utilisateurs, les rôles et les permissions."
    >
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <Text>
          Fonctionnalité en cours de développement. Cette section permettra de gérer les utilisateurs, 
          leurs rôles et permissions.
        </Text>
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminUsersPage;
