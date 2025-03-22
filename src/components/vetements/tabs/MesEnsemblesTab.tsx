
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { List } from "lucide-react";

const MesEnsemblesTab: React.FC = () => {
  return (
    <TabsContent value="mes-ensembles">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mes Ensembles</CardTitle>
          <CardDescription>Gérez vos ensembles de vêtements.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <List size={64} className="text-muted-foreground mb-4" />
          <Text className="text-center">
            La fonctionnalité de gestion des ensembles est en cours de développement.
          </Text>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MesEnsemblesTab;
