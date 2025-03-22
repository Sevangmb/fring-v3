
import React, { useState, useEffect } from 'react';
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import { Text } from "@/components/atoms/Typography";
import { Shirt, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ensemble, fetchEnsembles } from '@/services/ensembleService';
import EnsembleCard from '@/components/ensembles/EnsembleCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import VetementsTabsList from "@/components/vetements/tabs/VetementsTabsList";

const MesEnsembles = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ensembles, setEnsembles] = useState<Ensemble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("mes-tenues");
  
  useEffect(() => {
    const loadEnsembles = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEnsembles();
        setEnsembles(data);
      } catch (err) {
        console.error("Erreur lors du chargement des ensembles:", err);
        setError("Impossible de charger vos ensembles. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };
    
    loadEnsembles();
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
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
      
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} className="w-full mb-6">
          <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
          
          <TabsContent value="mes-tenues" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold">Mes Ensembles</h1>
              <Button 
                size="sm" 
                onClick={() => navigate('/ensembles/ajouter')}
                className="flex items-center gap-1"
              >
                <Plus size={16} />
                <span>Ajouter</span>
              </Button>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="h-64">
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-3/4" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-32 w-full mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Text className="text-center text-red-500">{error}</Text>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                </CardContent>
              </Card>
            ) : ensembles.length === 0 ? (
              <Card className="w-full">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Shirt size={64} className="text-muted-foreground mb-4" />
                  <Text className="text-center">Vous n'avez pas encore créé d'ensembles.</Text>
                  <Button 
                    className="mt-4" 
                    onClick={() => navigate('/ensembles/ajouter')}
                  >
                    Créer mon premier ensemble
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ensembles.map(ensemble => (
                  <EnsembleCard key={ensemble.id} ensemble={ensemble} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MesEnsembles;
