
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MesEnsemblesTab: React.FC = () => {
  return (
    <TabsContent value="mes-ensembles" className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-10">
            <h3 className="text-lg font-medium">Ensembles de vos amis</h3>
            <p className="text-muted-foreground mt-2">
              Consultez ici les ensembles créés par vos amis
            </p>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MesEnsemblesTab;
