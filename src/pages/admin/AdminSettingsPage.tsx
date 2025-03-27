
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { Text } from '@/components/atoms/Typography';
import { Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Configuration" 
      description="Configurez les paramètres de l'application."
    >
      <div className="flex flex-col items-center justify-center text-center py-12">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <Settings className="h-8 w-8 text-primary" />
        </div>
        <Text>
          Fonctionnalité en cours de développement. Cette section permettra de configurer les différents 
          paramètres de l'application, comme les notifications, les autorisations et les préférences générales.
        </Text>
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminSettingsPage;
