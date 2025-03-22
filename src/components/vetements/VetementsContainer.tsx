
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";

export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-ensembles' | 'ajouter-ensemble' | 'vetements-amis';

interface VetementsContainerProps {
  defaultTab?: TabType;
  children?: React.ReactNode;
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements',
  children
}) => {
  const navigate = useNavigate();
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
    
    // Navigation en fonction de l'onglet sélectionné
    if (value === "mes-vetements") {
      navigate("/mes-vetements");
    } else if (value === "ajouter-vetement") {
      navigate("/mes-vetements/ajouter");
    } else if (value === "mes-ensembles") {
      navigate("/ensembles");
    } else if (value === "ajouter-ensemble") {
      navigate("/ensembles/ajouter");
    } else if (value === "vetements-amis") {
      navigate("/vetements-amis");
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Tabs value={activeTab} className="w-full mb-6">
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        
        {/* Render tab content below the tabs */}
        {children}
      </Tabs>
    </>
  );
};

export default VetementsContainer;
