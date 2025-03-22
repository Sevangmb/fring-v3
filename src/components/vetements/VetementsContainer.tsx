
import React, { useEffect } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import MesVetementsTab from "./tabs/MesVetementsTab";
import VetementsAmisTab from "./tabs/VetementsAmisTab";
import AjouterEnsembleTab from "./tabs/AjouterEnsembleTab";
import MesEnsemblesTab from "./tabs/MesEnsemblesTab";

interface VetementsContainerProps {
  defaultTab?: 'mes-vetements' | 'vetements-amis' | 'ajouter-ensemble' | 'mes-ensembles';
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements' 
}) => {
  const { user } = useAuth();
  const { filteredAmis, loadingAmis, chargerAmis } = useAmis();
  const {
    searchTerm,
    categorieFilter,
    marqueFilter,
    friendFilter,
    activeTab,
    setActiveTab,
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

  // Charge les amis au chargement du composant
  useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  // Définit le mode de vue initial en fonction du paramètre defaultTab
  useEffect(() => {
    if (defaultTab === 'vetements-amis') {
      handleViewModeChange('vetements-amis');
    } else if (defaultTab === 'mes-vetements') {
      handleViewModeChange('mes-vetements');
    }
  }, [defaultTab, handleViewModeChange]);

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
    switch (value) {
      case "mes-vetements":
        handleViewModeChange('mes-vetements');
        break;
      case "vetements-amis":
        handleViewModeChange('vetements-amis');
        break;
      default:
        break;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full mb-6">
        <VetementsTabsList onTabChange={handleTabChange} />
        
        <MesVetementsTab 
          vetements={filteredVetements}
          categories={categories}
          marques={marques.map(m => m.nom)}
          acceptedFriends={acceptedFriends}
          activeTab={activeTab}
          isLoading={isLoading || loadingAmis}
          error={error}
          isAuthenticated={!!user}
          onVetementDeleted={handleVetementDeleted}
          onTabChange={setActiveTab}
        />
        
        <VetementsAmisTab 
          vetements={filteredVetements}
          categories={categories}
          marques={marques.map(m => m.nom)}
          acceptedFriends={acceptedFriends}
          activeTab={activeTab}
          isLoading={isLoading || loadingAmis}
          error={error}
          isAuthenticated={!!user}
          onVetementDeleted={handleVetementDeleted}
          onTabChange={setActiveTab}
        />
        
        <AjouterEnsembleTab />
        
        <MesEnsemblesTab acceptedFriends={acceptedFriends} />
      </Tabs>
    </>
  );
};

export default VetementsContainer;
