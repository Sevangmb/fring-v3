import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import AjouterEnsembleTab from "./tabs/AjouterEnsembleTab";
import MesVetementsTab from "./tabs/MesVetementsTab";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import MesEnsembles from "@/pages/ensembles/MesEnsembles";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useCategories } from "@/hooks/useCategories";

interface TabContentRendererProps {
  children?: React.ReactNode;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ children }) => {
  // Fetch the needed data for MesVetementsTab
  const { vetements, marques, isLoading, error } = useVetementsData('mes-vetements', '');
  const { categories, loadingCategories } = useCategories();
  
  // Ensure marques are strings, not objects
  const formattedMarques = marques.map(marque => 
    typeof marque === 'string' ? marque : marque.nom
  );
  
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
      
      {/* Other tab contents will be provided via children */}
      {children}
    </>
  );
};

export default TabContentRenderer;
