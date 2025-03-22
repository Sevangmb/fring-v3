
import React from 'react';
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import { Text } from "@/components/atoms/Typography";
import { ListPlus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AjouterEnsemble = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  return (
    <Layout>
      <Helmet>
        <title>Ajouter un Ensemble | Garde-Robe</title>
        <meta name="description" content="Créez un nouvel ensemble de vêtements" />
      </Helmet>
      
      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Ajouter un Ensemble</CardTitle>
            <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ListPlus size={64} className="text-muted-foreground mb-4" />
            <Text className="text-center mb-6">La fonctionnalité d'ajout d'ensembles est en cours de développement.</Text>
            <Button onClick={() => navigate("/mes-vetements")}>Retour aux vêtements</Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AjouterEnsemble;
