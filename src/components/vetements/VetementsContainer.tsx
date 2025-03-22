
import React, { useEffect } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs } from "@/components/ui/tabs";
import VetementsTabsList from "./tabs/VetementsTabsList";
import MesVetementsTab from "./tabs/MesVetementsTab";
import AjouterEnsembleTab from "./tabs/AjouterEnsembleTab";
import MesEnsemblesTab from "./tabs/MesEnsemblesTab";
import { useNavigate } from "react-router-dom";

interface VetementsContainerProps {
  defaultTab?: 'mes-vetements' | 'ajouter-vetement' | 'mes-tenues' | 'ajouter-tenue' | 'vetements-amis' | 'mes-ensembles';
}

const VetementsContainer: React.FC<VetementsContainerProps> = ({ 
  defaultTab = 'mes-vetements' 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { filteredAmis, loadingAmis, chargerAmis } = useAmis();
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
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
    if (defaultTab === 'mes-vetements') {
      handleViewModeChange('mes-vetements');
    } else if (defaultTab === 'vetements-amis') {
      handleViewModeChange('vetements-amis');
    } else if (defaultTab === 'mes-ensembles') {
      // Handle for the additional tab
      handleViewModeChange('mes-ensembles');
    }
  }, [defaultTab, handleViewModeChange]);

  // Met à jour l'email de l'ami sélectionné lorsque le filtre d'ami change
  useEffect(() => {
    if (viewMode === 'vetements-amis') {
      if (friendFilter !== "all") {
        console.log("Mise à jour du filtre d'ami:", friendFilter);
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
      case "ajouter-vetement":
        navigate("/mes-vetements/ajouter");
        break;
      case "mes-tenues":
        navigate("/ensembles");
        break;
      case "ajouter-tenue":
        navigate("/ensembles/ajouter");
        break;
      case "vetements-amis":
        handleViewModeChange('vetements-amis');
        break;
      case "mes-ensembles":
        handleViewModeChange('mes-ensembles');
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
        
        {/* Les autres onglets sont gérés par des redirections vers les pages correspondantes */}
      </Tabs>
    </>
  );
};

export default VetementsContainer;
