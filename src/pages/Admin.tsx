
import React from 'react';
import Layout from '@/components/templates/Layout';
import { Heading, Text } from '@/components/atoms/Typography';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Database, Users, Settings, Shirt, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  
  // Vérifiez si l'utilisateur est un administrateur (ajustez selon votre logique d'autorisation)
  const isAdmin = user?.email && ['admin@fring.app', 'sevans@hotmail.fr', 'pedro@hotmail.fr'].includes(user.email);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24">
          <div className="text-center">
            <Heading variant="h2" className="mb-4">Accès non autorisé</Heading>
            <Text className="mb-8">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</Text>
            <Button asChild>
              <a href="/">Retour à l'accueil</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const adminModules = [
    {
      title: "Gestion des utilisateurs",
      description: "Gérez les comptes utilisateurs, les rôles et les permissions.",
      icon: <Users className="h-8 w-8 text-primary" />,
      link: "/admin/users"
    },
    {
      title: "Gestion des vêtements",
      description: "Gérez le catalogue de vêtements et les catégories.",
      icon: <Shirt className="h-8 w-8 text-primary" />,
      link: "/admin/vetements"
    },
    {
      title: "Gestion des ensembles",
      description: "Gérez les ensembles et les suggestions.",
      icon: <ShoppingBag className="h-8 w-8 text-primary" />,
      link: "/admin/ensembles"
    },
    {
      title: "Configuration",
      description: "Configurez les paramètres de l'application.",
      icon: <Settings className="h-8 w-8 text-primary" />,
      link: "/admin/settings"
    },
    {
      title: "Base de données",
      description: "Gérez la base de données et les tables.",
      icon: <Database className="h-8 w-8 text-primary" />,
      link: "/admin/database"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <Heading variant="h2" className="mb-4">Administration</Heading>
          <Text variant="lead">Gérez les aspects de l'application Fring et supervisez les utilisateurs.</Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((module, index) => (
            <Card key={index} className="p-6 hover:shadow-md transition-shadow">
              <div className="mb-4">{module.icon}</div>
              <Heading variant="h4" className="mb-2">{module.title}</Heading>
              <Text variant="small" className="text-muted-foreground mb-4">{module.description}</Text>
              <Button asChild variant="outline" className="w-full">
                <a href={module.link}>Accéder</a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
