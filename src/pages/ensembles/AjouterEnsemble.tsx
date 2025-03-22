
import React, { useState, useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Heading, Text } from "@/components/atoms/Typography";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import { Vetement } from "@/services/vetement/types";
import { VetementType } from "@/services/meteo/tenue";
import { createEnsemble } from "@/services/ensembleService";
import { fetchVetements, fetchVetementsAmis } from "@/services/vetement";
import { Loader2, ArrowRight, ListPlus } from "lucide-react";
import { initializeEnsembleData } from "@/services/database/ensembleInitialization";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AjouterEnsemble = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [mesVetements, setMesVetements] = useState<Vetement[]>([]);
  const [vetementsAmis, setVetementsAmis] = useState<Vetement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{
    haut: Vetement | null;
    bas: Vetement | null;
    chaussures: Vetement | null;
  }>({
    haut: null,
    bas: null,
    chaussures: null
  });
  const [creating, setCreating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [activeSource, setActiveSource] = useState<'mes-vetements' | 'vetements-amis'>('mes-vetements');

  // Initialiser la structure de la base de données
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeEnsembleData();
        setInitialized(true);
      } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
      }
    };
    initialize();
  }, []);

  // Charger les vêtements (personnels et amis)
  useEffect(() => {
    const loadAllVetements = async () => {
      try {
        setLoading(true);
        const [mesVetementsData, vetementsAmisData] = await Promise.all([
          fetchVetements(),
          fetchVetementsAmis()
        ]);
        
        setMesVetements(mesVetementsData);
        setVetementsAmis(vetementsAmisData);
        console.log("Vêtements personnels chargés:", mesVetementsData.length);
        console.log("Vêtements des amis chargés:", vetementsAmisData.length);
      } catch (error) {
        console.error("Erreur lors du chargement des vêtements:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les vêtements.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      loadAllVetements();
    }
  }, [user, toast]);
  
  const handleCreateEnsemble = async () => {
    // Vérifier que tous les éléments sont sélectionnés
    if (!selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures) {
      toast({
        title: "Sélection incomplète",
        description: "Veuillez sélectionner un haut, un bas et des chaussures pour créer un ensemble.",
        variant: "destructive"
      });
      return;
    }
    try {
      setCreating(true);

      // Créer l'ensemble
      await createEnsemble({
        nom: `Ensemble du ${new Date().toLocaleDateString()}`,
        description: "Ensemble créé manuellement",
        vetements: [{
          id: selectedItems.haut.id,
          type: VetementType.HAUT
        }, {
          id: selectedItems.bas.id,
          type: VetementType.BAS
        }, {
          id: selectedItems.chaussures.id,
          type: VetementType.CHAUSSURES
        }]
      });
      toast({
        title: "Ensemble créé",
        description: "Votre ensemble a été créé avec succès.",
        variant: "default"
      });

      // Rediriger vers la page des ensembles
      navigate("/ensembles");
    } catch (error) {
      console.error("Erreur lors de la création de l'ensemble:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'ensemble. La base de données est peut-être en cours d'initialisation, veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  // Obtenir les vêtements actuellement actifs selon l'onglet sélectionné
  const activeVetements = activeSource === 'mes-vetements' ? mesVetements : vetementsAmis;
  
  return (
    <Layout>
      <Helmet>
        <title>Créer un Ensemble | Garde-Robe</title>
        <meta name="description" content="Créez un nouvel ensemble de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-muted/30 rounded-lg">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <span className="text-muted-foreground">Chargement de vos vêtements...</span>
            </div>
          ) : mesVetements.length === 0 && vetementsAmis.length === 0 ? (
            <Card className="text-center py-12 shadow-md border-primary/10">
              <CardContent className="flex flex-col items-center space-y-4">
                <ListPlus className="h-16 w-16 text-muted-foreground mb-2" />
                <Heading className="text-xl">Aucun vêtement disponible</Heading>
                <span className="text-muted-foreground mb-4 max-w-md">
                  Ajoutez d'abord quelques vêtements à votre garde-robe pour pouvoir créer des ensembles.
                </span>
                <Button size="lg" onClick={() => navigate("/mes-vetements/ajouter")} className="gap-2">
                  Ajouter un vêtement
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-primary/10 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 border-b">
                <Heading className="text-lg text-center">Créez votre ensemble</Heading>
              </div>
              <CardContent className="p-6">
                <Tabs 
                  defaultValue="mes-vetements" 
                  className="mb-6"
                  onValueChange={(value) => setActiveSource(value as 'mes-vetements' | 'vetements-amis')}
                >
                  <div className="flex justify-center mb-4">
                    <TabsList>
                      <TabsTrigger value="mes-vetements">Mes vêtements</TabsTrigger>
                      <TabsTrigger value="vetements-amis" disabled={vetementsAmis.length === 0}>
                        Vêtements des amis {vetementsAmis.length > 0 && `(${vetementsAmis.length})`}
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <Text className="text-center text-muted-foreground mb-4 text-sm">
                    {activeSource === 'mes-vetements' 
                      ? "Utilisez vos propres vêtements pour créer l'ensemble"
                      : "Utilisez les vêtements partagés par vos amis pour créer l'ensemble"
                    }
                  </Text>
                </Tabs>
                
                <EnsembleCreator 
                  vetements={activeVetements} 
                  onItemsSelected={setSelectedItems} 
                  selectedItems={selectedItems}
                  showOwner={activeSource === 'vetements-amis'}
                />
                
                <div className="flex justify-center mt-8 pt-4 border-t">
                  <Button 
                    size="lg" 
                    className="gap-2 px-6 min-w-40" 
                    onClick={handleCreateEnsemble} 
                    disabled={creating || !selectedItems.haut || !selectedItems.bas || !selectedItems.chaussures}
                  >
                    {creating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : "Créer cet ensemble"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AjouterEnsemble;
