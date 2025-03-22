import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";

export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-tenues' | 'ajouter-tenue' | 'mes-ensembles';

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
      setActiveTab("mes-tenues");
    } else if (location.pathname === "/ensembles/ajouter") {
      setActiveTab("ajouter-tenue");
    } else if (location.pathname === "/ensembles-amis") {
      setActiveTab("mes-ensembles");
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
      <Tabs value={activeTab} className="w-full mb-6">
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        
        {/* Le contenu est maintenant injecté depuis l'extérieur */}
        {children}
      </Tabs>
    </>
  );
};

export default VetementsContainer;
