
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { Text } from '@/components/atoms/Typography';
import { ChartBar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminStatsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Statistiques" 
      description="Consultez les statistiques d'utilisation de l'application."
    >
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <ChartBar className="h-8 w-8 text-primary" />
        </div>
        <Text>
          Fonctionnalité en cours de développement. Cette section affichera des statistiques sur l'utilisation 
          de l'application, les tendances et d'autres métriques importantes.
        </Text>
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminStatsPage;
