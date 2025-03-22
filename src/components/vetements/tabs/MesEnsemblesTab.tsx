
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import { Ami } from "@/services/amis";
import { Categorie } from "@/services/categorieService";
import EnsemblesAmisList from "@/components/ensembles/EnsemblesAmisList";

interface MesEnsemblesTabProps {
  categories?: Categorie[];
  marques?: string[];
  acceptedFriends?: Ami[];
  isLoading?: boolean;
  description?: string;
}

const MesEnsemblesTab: React.FC<MesEnsemblesTabProps> = ({
  categories = [],
  marques = [],
  acceptedFriends = [],
  isLoading = false,
  description
}) => {
  return (
    <TabsContent value="mes-ensembles" className="mt-6">
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      
      <SearchFilterProvider 
        categories={categories}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={true}
      >
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Ensembles de vos amis</h3>
            <EnsemblesAmisList />
          </CardContent>
        </Card>
      </SearchFilterProvider>
    </TabsContent>
  );
};

export default MesEnsemblesTab;
