
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TabType } from "@/components/vetements/types/TabTypes";

export function useVetementsTabState(defaultTab: TabType = 'mes-favoris') {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>(
    location.state?.activeTab ? (location.state.activeTab as TabType) : defaultTab
  );
  
  useEffect(() => {
    if (location.pathname === "/mes-vetements") {
      // Don't override when pathname is /mes-vetements but there's a state with activeTab
      if (!location.state?.activeTab) {
        setActiveTab("mes-vetements");
      }
    } else if (location.pathname === "/ensembles") {
      // Similar logic for the ensembles path
      if (!location.state?.activeTab) {
        setActiveTab("mes-ensembles");
      }
    }
  }, [location.pathname, location.state]);

  const handleTabChange = (value: TabType) => {
    setActiveTab(value);
  };
  
  return {
    activeTab,
    setActiveTab,
    handleTabChange
  };
}
