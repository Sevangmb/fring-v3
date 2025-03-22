import React, { useEffect, useState } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import MesVetementsTab from "./tabs/MesVetementsTab";
import { useNavigate, useLocation } from "react-router-dom";

export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-tenues' | 'ajouter-tenue' | 'mes-ensembles';

interface VetementsContainerProps {
  defaultTab?: TabType;
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { filteredAmis, loadingAmis, chargerAmis } = useAmis();
  const [activeTab, setActiveTab] = useState<TabType>(defaultTab);
  
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
    activeTab: categoryTab,
    setActiveTab: setCategoryTab,
    viewMode,
    handleViewModeChange,
    filterVetements
  } = useVetementsFilters();

  const {
    vetements,
    categories,
    marques,
    isLoading,
    error,
    setSelectedFriendEmail,
    reloadVetements
  } = useVetementsData(viewMode, friendFilter);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];

  useEffect(() => {
    if (location.pathname === "/mes-vetements") {
      setActiveTab("mes-vetements");
      handleViewModeChange('mes-vetements');
    } else if (location.pathname === "/mes-vetements/ajouter") {
      setActiveTab("ajouter-vetement");
    } else if (location.pathname === "/ensembles") {
      setActiveTab("mes-tenues");
    } else if (location.pathname === "/ensembles/ajouter") {
      setActiveTab("ajouter-tenue");
    } else if (location.pathname === "/ensembles-amis") {
      setActiveTab("mes-ensembles");
    }
  }, [location.pathname, handleViewModeChange]);

  useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  useEffect(() => {
    if (viewMode === 'vetements-amis') {
      if (friendFilter !== "all") {
        const selectedFriend = acceptedFriends.find(ami => 
          (ami.user_id === ami.ami_id ? ami.ami_id : ami.user_id) === friendFilter
        );
        setSelectedFriendEmail(selectedFriend?.email);
      } else {
        setSelectedFriendEmail(undefined);
      }
      reloadVetements();
    }
  }, [friendFilter, acceptedFriends, viewMode, setSelectedFriendEmail, reloadVetements]);

  const filteredVetements = filterVetements(vetements, categories);

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType);
  };

  const renderTabContent = () => {
    if (activeTab === "mes-vetements") {
      return (
        <MesVetementsTab 
          vetements={filteredVetements}
          categories={categories}
          marques={marques.map(m => m.nom)}
          acceptedFriends={acceptedFriends}
          activeTab={categoryTab}
          isLoading={isLoading || loadingAmis}
          error={error}
          isAuthenticated={!!user}
          onVetementDeleted={handleVetementDeleted}
          onTabChange={setCategoryTab}
        />
      );
    }
    
    return null;
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Tabs value={activeTab} className="w-full mb-6">
        <VetementsTabsList onTabChange={handleTabChange} activeTab={activeTab} />
        {renderTabContent()}
      </Tabs>
    </>
  );
};

export default VetementsContainer;
