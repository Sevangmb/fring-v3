
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { ListPlus } from "lucide-react";
import { useEnsembleCreation } from "@/hooks/ensembles/useEnsembleCreation";
import EnsembleForm from "@/components/ensembles/EnsembleForm";
import { Loader2 } from "lucide-react";

const AjouterEnsembleTab: React.FC = () => {
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
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un Ensemble</CardTitle>
          <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 size={64} className="text-primary animate-spin mb-4" />
          <Text className="text-center mb-6">
            Chargement des vêtements...
          </Text>
        </CardContent>
      </Card>
    );
  }

  if (allVetements && allVetements.length > 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un Ensemble</CardTitle>
          <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
        </CardHeader>
        <CardContent>
          <EnsembleForm
            vetements={allVetements}
            selectedItems={selectedItems}
            onItemsSelected={handleItemsSelected}
            creating={creating}
            onSubmit={handleCreateEnsemble}
          />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ajouter un Ensemble</CardTitle>
        <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-12">
        <ListPlus size={64} className="text-muted-foreground mb-4" />
        <Text className="text-center mb-6">
          Vous n'avez pas encore de vêtements pour créer un ensemble.
          Ajoutez d'abord quelques vêtements à votre garde-robe.
        </Text>
      </CardContent>
    </Card>
  );
};

export default AjouterEnsembleTab;
