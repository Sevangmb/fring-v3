
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useEnsembleCreation } from "@/hooks/ensembles/useEnsembleCreation";
import EnsembleLoading from "@/components/ensembles/EnsembleLoading";
import EnsembleEmptyState from "@/components/ensembles/EnsembleEmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/atoms/Typography";
import { Loader2 } from "lucide-react";
import EnsembleCreator from "@/components/ensembles/EnsembleCreator";
import EnsembleFormFields from "@/components/ensembles/EnsembleFormFields";

const AjouterEnsemble = () => {
  const {
    allVetements,
    loadingVetements,
    selectedItems,
    formData,
    creating,
    handleItemsSelected,
    handleChange,
    handleCreateEnsemble
  } = useEnsembleCreation();
  
  if (loadingVetements) {
    return (
      <Layout>
        <Helmet>
          <title>Créer un Ensemble | Garde-Robe</title>
          <meta name="description" content="Créez un nouvel ensemble de vêtements" />
        </Helmet>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <EnsembleLoading />
          </div>
        </div>
      </Layout>
    );
  }
  
  if (allVetements.length === 0) {
    return (
      <Layout>
        <Helmet>
          <title>Créer un Ensemble | Garde-Robe</title>
          <meta name="description" content="Créez un nouvel ensemble de vêtements" />
        </Helmet>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto">
            <EnsembleEmptyState />
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>Créer un Ensemble | Garde-Robe</title>
        <meta name="description" content="Créez un nouvel ensemble de vêtements" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-lg border-primary/10 overflow-hidden">
            <div className="bg-gradient-to-r from-primary/5 to-accent/10 p-4 border-b">
              <Heading className="text-lg text-center">Créez votre ensemble</Heading>
            </div>
            <CardContent className="p-6">
              <Text className="text-center text-muted-foreground mb-6 text-sm">
                Sélectionnez un vêtement pour chaque catégorie, vous pouvez choisir parmi vos vêtements ou ceux de vos amis.
              </Text>
              
              <div className="space-y-4 mb-6">
                <EnsembleFormFields
                  formData={formData}
                  onChange={handleChange}
                />
              </div>
              
              <EnsembleCreator 
                vetements={allVetements} 
                onItemsSelected={handleItemsSelected} 
                selectedItems={selectedItems}
                showOwner={true}
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
        </div>
      </div>
    </Layout>
  );
};

export default AjouterEnsemble;
