
import React from 'react';
import Layout from '@/components/templates/Layout';
import { Heading, Text } from '@/components/atoms/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminAccessDenied from '@/components/admin/AdminAccessDenied';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérification des autorisations administratives
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Heading variant="h2" className="mb-4">Administration</Heading>
          <Text variant="lead">Gérez les aspects de l'application Fring et supervisez les utilisateurs.</Text>
        </div>

        <AdminDashboard />
      </div>
    </Layout>
  );
};

export default AdminPage;
