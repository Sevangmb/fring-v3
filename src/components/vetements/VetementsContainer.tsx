import React, { useEffect, useState } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import MesVetementsTab from "./tabs/MesVetementsTab";
import { useNavigate, useLocation } from "react-router-dom";

interface VetementsContainerProps {
  defaultTab?: 'mes-vetements' | 'ajouter-vetement' | 'mes-tenues' | 'ajouter-tenue';
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements' 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { filteredAmis, loadingAmis, chargerAmis } = useAmis();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
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

  // Update active tab based on route
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
    }
  }, [location.pathname, handleViewModeChange]);

  // Charge les amis au chargement du composant
  useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  // Met à jour l'email de l'ami sélectionné lorsque le filtre d'ami change
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
      // Recharger les vêtements quand le filtre d'ami change
      reloadVetements();
    }
  }, [friendFilter, acceptedFriends, viewMode, setSelectedFriendEmail, reloadVetements]);

  const filteredVetements = filterVetements(vetements, categories);

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Only render content for the current active tab
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
    
    // Other tabs are handled by route navigation in VetementsTabsList
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
