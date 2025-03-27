
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { Text } from '@/components/atoms/Typography';
import { Shirt } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminVetementsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Gestion des vêtements" 
      description="Gérez le catalogue de vêtements et les catégories."
    >
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Shirt className="h-8 w-8 text-primary" />
        </div>
        <Text>
          Fonctionnalité en cours de développement. Cette section permettra de gérer les vêtements, 
          les catégories et d'autres attributs liés aux produits.
        </Text>
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminVetementsPage;
