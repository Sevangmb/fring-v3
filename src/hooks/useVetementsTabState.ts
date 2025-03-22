
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TabType } from "@/components/vetements/types/TabTypes";

export function useVetementsTabState(defaultTab: TabType = 'mes-vetements') {
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
    } else if (location.pathname === "/mes-vetements/ajouter") {
      setActiveTab("ajouter-vetement");
    } else if (location.pathname === "/ensembles") {
      setActiveTab("mes-ensembles");
    } else if (location.pathname === "/ensembles/ajouter") {
      setActiveTab("ajouter-ensemble");
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
