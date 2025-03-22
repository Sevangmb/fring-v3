
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import AjouterVetement from "@/pages/vetements/AjouterVetement";
import AjouterEnsemble from "@/pages/ensembles/AjouterEnsemble";
import { Helmet } from "react-helmet";

export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-ensembles' | 'ajouter-ensemble' | 'vetements-amis' | 'mes-tenues';

interface VetementsContainerProps {
  defaultTab?: TabType;
  children?: React.ReactNode;
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements',
  children
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  
  useEffect(() => {
    if (location.pathname === "/mes-vetements") {
      setActiveTab("mes-vetements");
    } else if (location.pathname === "/mes-vetements/ajouter") {
      setActiveTab("ajouter-vetement");
    } else if (location.pathname === "/ensembles") {
      setActiveTab("mes-ensembles");
    } else if (location.pathname === "/ensembles/ajouter") {
      setActiveTab("ajouter-ensemble");
    } else if (location.pathname === "/vetements-amis") {
      setActiveTab("vetements-amis");
    }
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Tabs value={activeTab} className="w-full mb-6" onValueChange={handleTabChange}>
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        
        {/* Render tab content based on activeTab */}
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
        
        <TabsContent value="vetements-amis">
          {activeTab === "vetements-amis" && children}
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VetementsContainer;
