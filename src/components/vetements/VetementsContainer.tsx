
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import TabContentRenderer from "./TabContentRenderer";
import { useVetementsTabState } from "@/hooks/useVetementsTabState";
import { TabType } from "./types/TabTypes";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

interface VetementsContainerProps {
  defaultTab?: TabType;
  children?: React.ReactNode;
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements',
  children
}) => {
  const { user } = useAuth();
  const location = useLocation();
  const { activeTab, handleTabChange, setActiveTab } = useVetementsTabState(defaultTab);
  
  // Écouter les changements de state venant de la navigation
  useEffect(() => {
    if (location.state?.activeTab) {
      console.log("Setting active tab from location state:", location.state.activeTab);
      setActiveTab(location.state.activeTab as TabType);
    }
  }, [location.state, setActiveTab]);
  
  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>
          {activeTab === 'mes-vetements' ? 'Mes Vêtements' : 
           activeTab === 'ajouter-vetement' ? 'Ajouter un vêtement' : 
           activeTab === 'mes-ensembles' ? 'Mes Tenues' : 
           activeTab === 'ajouter-ensemble' ? 'Ajouter une tenue' :
           activeTab === 'mes-favoris' ? 'Mes Favoris' :
           'Vêtements de mes amis'}
        </title>
      </Helmet>
      
      <Tabs value={activeTab} className="w-full mb-6" onValueChange={(value) => handleTabChange(value as TabType)}>
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        <TabContentRenderer activeTab={activeTab}>
          {children}
        </TabContentRenderer>
      </Tabs>
    </>
  );
};

export default VetementsContainer;
export type { TabType };
