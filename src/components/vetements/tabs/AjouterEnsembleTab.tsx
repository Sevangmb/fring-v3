
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { ListPlus } from "lucide-react";

const AjouterEnsembleTab: React.FC = () => {
  return (
    <TabsContent value="ajouter-ensemble">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Ajouter un Ensemble</CardTitle>
          <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ListPlus size={64} className="text-muted-foreground mb-4" />
          <Text className="text-center mb-6">
            La fonctionnalité d'ajout d'ensembles est en cours de développement.
          </Text>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AjouterEnsembleTab;
