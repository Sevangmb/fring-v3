import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import AjouterEnsembleTab from "./tabs/AjouterEnsembleTab";
import MesVetementsTab from "./tabs/MesVetementsTab";
import VetementsAmisTab from "./tabs/VetementsAmisTab";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import MesEnsembles from "@/pages/ensembles/MesEnsembles";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useCategories } from "@/hooks/useCategories";
import { useAmis } from "@/hooks/useAmis";
import EnsemblesAmisList from "../ensembles/EnsemblesAmisList";

interface TabContentRendererProps {
  children?: React.ReactNode;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ children }) => {
  // Fetch the needed data for MesVetementsTab
  const { vetements, marques, isLoading, error, handleVetementDeleted } = useVetementsData('mes-vetements', '');
  const { categories, loadingCategories } = useCategories();
  const { filteredAmis, loadingAmis } = useAmis();
  
  // Ensure marques are strings, not objects
  const formattedMarques = marques.map(marque => 
    typeof marque === 'string' ? marque : marque.nom
  );

  const acceptedFriends = filteredAmis?.amisAcceptes || [];
  
  return (
    <>
      <TabsContent value="mes-vetements">
        <MesVetementsTab 
          vetements={vetements}
          categories={categories}
          marques={formattedMarques}
          isLoading={isLoading || loadingCategories}
          error={error}
          isAuthenticated={true}
          onVetementDeleted={handleVetementDeleted}
        />
      </TabsContent>
      
      <TabsContent value="ajouter-vetement">
        <AjouterVetement />
      </TabsContent>
      
      <TabsContent value="mes-ensembles">
        <MesEnsembles asTabContent={true} />
      </TabsContent>
      
      <TabsContent value="ajouter-ensemble">
        <AjouterEnsembleTab />
      </TabsContent>
      
      <TabsContent value="vetements-amis">
        <VetementsAmisTab
          vetements={[]} 
          categories={categories}
          marques={formattedMarques}
          acceptedFriends={acceptedFriends}
          isLoading={isLoading || loadingAmis || loadingCategories}
          error={error}
          isAuthenticated={true}
          onVetementDeleted={handleVetementDeleted}
          description="Parcourez les vêtements partagés par vos amis."
        />
      </TabsContent>
      
      <TabsContent value="ensembles-amis">
        <EnsemblesAmisList />
      </TabsContent>
      
      {/* Other tab contents will be provided via children */}
      {children}
    </>
  );
};

export default TabContentRenderer;
