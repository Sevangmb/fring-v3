
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TabType } from "@/components/vetements/types/TabTypes";

export function useVetementsTabState(defaultTab: TabType = 'mes-vetements') {
  const location = useLocation();
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
    }
  }, [location.pathname]);

  const handleTabChange = (value: TabType) => {
    setActiveTab(value);
  };
  
  return {
    activeTab,
    setActiveTab,
    handleTabChange
  };
}
