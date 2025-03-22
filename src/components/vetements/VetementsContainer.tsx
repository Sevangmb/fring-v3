
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

  const getPageTitle = () => {
    switch (activeTab) {
      case 'mes-vetements': return 'Mes Vêtements';
      case 'ajouter-vetement': return 'Ajouter un Vêtement';
      case 'mes-ensembles': return 'Mes Tenues';
      case 'ajouter-ensemble': return 'Ajouter une Tenue';
      default: return 'Mes Vêtements';
    }
  };

  return (
    <>
      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>
      
      <Tabs value={activeTab} className="w-full mb-6" onValueChange={(value) => handleTabChange(value as TabType)}>
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        <TabContentRenderer>
          {children}
        </TabContentRenderer>
      </Tabs>
    </>
  );
};

export default VetementsContainer;
export type { TabType };
