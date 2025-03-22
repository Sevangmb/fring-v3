
import React from 'react';
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import { Heading, Text } from "@/components/atoms/Typography";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import { Vetement } from "@/services/vetement/types";
import { useState, useEffect } from "react";
import { VetementType } from "@/services/meteo/tenue";
import { createEnsemble } from "@/services/ensembleService";
import { fetchVetements } from "@/services/vetement";

const AjouterEnsemble = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{
    haut: Vetement | null,
    bas: Vetement | null,
    chaussures: Vetement | null
  }>({
    haut: null,
    bas: null,
    chaussures: null
  });
  const [creating, setCreating] = useState(false);

  // Charger les vêtements de l'utilisateur
  useEffect(() => {
    const loadVetements = async () => {
      try {
        setLoading(true);
        const data = await fetchVetements();
        setVetements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des vêtements:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos vêtements.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadVetements();
    }
  }, [user, toast]);

  const handleCreateEnsemble = async () => {
    // Vérifier que tous les éléments sont sélectionnés
    if (!selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un haut, un bas et des chaussures pour créer un ensemble.",
        variant: "destructive",
      });
      return;
    }

    try {
      setCreating(true);
      
      // Créer l'ensemble
      await createEnsemble({
        nom: `Ensemble du ${new Date().toLocaleDateString()}`,
        description: "Ensemble créé manuellement",
        vetements: [
          { id: selectedItems.haut.id, type: VetementType.HAUT },
          { id: selectedItems.bas.id, type: VetementType.BAS },
          { id: selectedItems.chaussures.id, type: VetementType.CHAUSSURES }
        ]
      });

      toast({
        title: "Ensemble créé",
        description: "Votre ensemble a été créé avec succès.",
        variant: "default",
      });

      // Rediriger vers la page des ensembles
      navigate("/ensembles");
    } catch (error) {
      console.error("Erreur lors de la création de l'ensemble:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'ensemble.",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

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
            <CardTitle>Composer un Ensemble</CardTitle>
            <Text variant="subtle">Sélectionnez un haut, un bas et des chaussures pour créer votre ensemble.</Text>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
              </div>
            ) : vetements.length === 0 ? (
              <div className="text-center py-12">
                <Text>Vous n'avez pas encore de vêtements. Ajoutez-en pour créer des ensembles.</Text>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate("/mes-vetements/ajouter")}
                >
                  Ajouter un vêtement
                </Button>
              </div>
            ) : (
              <>
                <EnsembleCreator 
                  vetements={vetements} 
                  onItemsSelected={setSelectedItems} 
                  selectedItems={selectedItems}
                />
                
                <div className="flex justify-center mt-8">
                  <Button 
                    className="px-8" 
                    onClick={handleCreateEnsemble} 
                    disabled={creating || !selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures}
                  >
                    {creating ? "Création en cours..." : "Créer cet ensemble"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AjouterEnsemble;
