
import React from 'react';
import { Card } from '@/components/ui/card';
import { Heading, Text } from '@/components/atoms/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Database, Users, Settings, Shirt, ShoppingBag, ChartBar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminModuleProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  className?: string;
}

const AdminModule: React.FC<AdminModuleProps> = ({ 
  title, 
  description, 
  icon, 
  link,
  className
}) => {
  return (
    <Card className={cn("p-6 hover:shadow-md transition-shadow", className)}>
      <div className="mb-4">{icon}</div>
      <Heading variant="h4" className="mb-2">{title}</Heading>
      <Text variant="small" className="text-muted-foreground mb-4">{description}</Text>
      <Button asChild variant="outline" className="w-full">
        <Link to={link}>Accéder</Link>
      </Button>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
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
      title: "Statistiques",
      description: "Consultez les statistiques d'utilisation de l'application.",
      icon: <ChartBar className="h-8 w-8 text-primary" />,
      link: "/admin/stats"
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {adminModules.map((module, index) => (
        <AdminModule
          key={index}
          title={module.title}
          description={module.description}
          icon={module.icon}
          link={module.link}
        />
      ))}
    </div>
  );
};

export default AdminDashboard;
