
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/templates/Layout';
import AdminDashboard from '@/components/admin/AdminDashboard';

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Modification: Accepter votre compte actuel comme administrateur
  // Cette liste pourrait être déplacée dans une configuration ou en base de données
  const adminEmails = ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'];
  const isAdmin = user?.email && adminEmails.includes(user.email);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  // Rediriger si l'utilisateur n'est pas un admin
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <AdminDashboard />
    </Layout>
  );
};

export default Admin;
