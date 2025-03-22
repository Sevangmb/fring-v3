
import React from 'react';
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import { Text } from "@/components/atoms/Typography";
import { Shirt } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MesEnsembles = () => {
  const { user } = useAuth();
  
  return (
    <Layout>
      <Helmet>
        <title>Mes Ensembles | Garde-Robe</title>
        <meta name="description" content="Consultez et gérez vos ensembles de vêtements" />
      </Helmet>
      
      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Mes Ensembles</CardTitle>
            <CardDescription>Gérez vos ensembles de vêtements.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shirt size={64} className="text-muted-foreground mb-4" />
            <Text className="text-center">La fonctionnalité de gestion des ensembles est en cours de développement.</Text>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MesEnsembles;
