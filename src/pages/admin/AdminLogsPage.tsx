
import React from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import LogsViewer from '@/components/admin/logs/LogsViewer';

const AdminLogsPage: React.FC = () => {
  const { user } = useAuth();
  
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
      title="Logs système" 
      description="Surveillez l'activité système et les erreurs de l'application Fring."
    >
      <LogsViewer />
    </AdminModuleTemplate>
  );
};

export default AdminLogsPage;
