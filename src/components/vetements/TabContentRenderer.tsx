
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import AjouterEnsemble from "@/pages/ensembles/AjouterEnsemble";
import { TabType } from "./types/TabTypes";

interface TabContentRendererProps {
  activeTab: TabType;
  children?: React.ReactNode;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({ 
  activeTab,
  children
}) => {
  return (
    <>
      <TabsContent value="mes-vetements">
        {activeTab === "mes-vetements" && children}
      </TabsContent>
      
      <TabsContent value="ajouter-vetement">
        {activeTab === "ajouter-vetement" && <AjouterVetement />}
      </TabsContent>
      
      <TabsContent value="mes-ensembles">
        {activeTab === "mes-ensembles" && children}
      </TabsContent>
      
      <TabsContent value="ajouter-ensemble">
        {activeTab === "ajouter-ensemble" && <AjouterEnsemble />}
      </TabsContent>
    </>
  );
};

export default TabContentRenderer;
