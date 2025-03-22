
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import { Ami } from "@/services/amis";
import { Categorie } from "@/services/categorieService";

interface MesEnsemblesTabProps {
  categories?: Categorie[];
  marques?: string[];
  acceptedFriends?: Ami[];
  isLoading?: boolean;
}

const MesEnsemblesTab: React.FC<MesEnsemblesTabProps> = ({
  categories = [],
  marques = [],
  acceptedFriends = [],
  isLoading = false
}) => {
  return (
    <TabsContent value="mes-ensembles" className="mt-6">
      <SearchFilterProvider 
        categories={categories}
        marques={marques}
        friends={acceptedFriends}
        showFriendFilter={true}
      >
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium">Ensembles de vos amis</h3>
                <p className="text-muted-foreground mt-2">
                  Consultez ici les ensembles créés par vos amis
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </SearchFilterProvider>
    </TabsContent>
  );
};

export default MesEnsemblesTab;
