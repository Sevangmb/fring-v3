
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Shirt, 
  Users, 
  BookOpen,
  MessageSquare,
  RefreshCw
} from "lucide-react";

const DataManagement = () => {
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const { toast } = useToast();

  const handleRefresh = (entityType: string) => {
    setLoading(prev => ({ ...prev, [entityType]: true }));
    
    // Simulation d'une opération asynchrone
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [entityType]: false }));
      toast({
        title: "Rafraîchi",
        description: `Données ${entityType} rafraîchies avec succès`,
      });
    }, 1500);
  };

  const dataEntities = [
    {
      id: "vetements",
      title: "Vêtements",
      description: "Gestion des vêtements enregistrés",
      icon: <Shirt className="h-5 w-5" />,
      count: 245,
    },
    {
      id: "users",
      title: "Utilisateurs",
      description: "Gestion des utilisateurs de la plateforme",
      icon: <Users className="h-5 w-5" />,
      count: 53,
    },
    {
      id: "ensembles",
      title: "Ensembles",
      description: "Gestion des ensembles créés",
      icon: <BookOpen className="h-5 w-5" />,
      count: 87,
    },
    {
      id: "messages",
      title: "Messages",
      description: "Gestion des messages entre utilisateurs",
      icon: <MessageSquare className="h-5 w-5" />,
      count: 124,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gestion des données</h2>
        <Button size="sm" className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span>Exporter les données</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dataEntities.map((entity) => (
          <Card key={entity.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                {entity.icon}
                <CardTitle className="text-sm font-medium">
                  {entity.title}
                </CardTitle>
              </div>
              <Badge variant="outline">{entity.count}</Badge>
            </CardHeader>
            <CardContent>
              <CardDescription>{entity.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleRefresh(entity.id)}
                disabled={loading[entity.id]}
              >
                {loading[entity.id] ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                <span>Rafraîchir</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DataManagement;
