import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import AjouterEnsembleTab from "./tabs/AjouterEnsembleTab";
import MesFavorisTab from "./tabs/MesFavorisTab";
import MesVetementsTab from "./tabs/MesVetementsTab";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import MesEnsembles from "@/pages/ensembles/MesEnsembles";

interface TabContentRendererProps {
  children?: React.ReactNode;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ children }) => {
  return (
    <>
      <TabsContent value="mes-vetements">
        <MesVetementsTab />
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
      
      <TabsContent value="mes-favoris">
        <MesFavorisTab />
      </TabsContent>
      
      {/* Other tab contents will be provided via children */}
      {children}
    </>
  );
};

export default TabContentRenderer;
