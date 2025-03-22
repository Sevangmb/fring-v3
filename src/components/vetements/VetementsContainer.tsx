
import React, { useEffect } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { Shirt, Users, ListPlus, List } from "lucide-react";

const VetementsContainer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { filteredAmis, loadingAmis } = useAmis();
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
    setSelectedFriendEmail
  } = useVetementsData(viewMode, friendFilter);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];

  useEffect(() => {
    if (viewMode === 'vetements-amis' && friendFilter !== "all") {
      const selectedFriend = acceptedFriends.find(ami => 
        (ami.user_id === ami.ami_id ? ami.ami_id : ami.user_id) === friendFilter
      );
      setSelectedFriendEmail(selectedFriend?.email);
    } else {
      setSelectedFriendEmail(undefined);
    }
  }, [friendFilter, acceptedFriends, viewMode, setSelectedFriendEmail]);

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
      case "ajouter-ensemble":
        navigate("/ensembles/ajouter");
        break;
      case "mes-ensembles":
        navigate("/ensembles");
        break;
      default:
        break;
    }
  };

  if (!user) {
    return (
      <VetementsList 
        vetements={[]}
        isLoading={false}
        error={null}
        isAuthenticated={false}
        onVetementDeleted={() => {}}
        showOwner={false}
      />
    );
  }

  return (
    <>
      <Tabs defaultValue="mes-vetements" onValueChange={handleTabChange} className="w-full mb-6">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="mes-vetements" className="flex items-center gap-2">
            <Shirt className="h-4 w-4" />
            Mes Vêtements
          </TabsTrigger>
          <TabsTrigger value="vetements-amis" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vêtements Amis
          </TabsTrigger>
          <TabsTrigger value="ajouter-ensemble" className="flex items-center gap-2">
            <ListPlus className="h-4 w-4" />
            Ajouter Ensemble
          </TabsTrigger>
          <TabsTrigger value="mes-ensembles" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Mes Ensembles
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {(viewMode === 'mes-vetements' || viewMode === 'vetements-amis') && (
        <>
          <SearchFilterProvider
            categories={categories}
            marques={marques}
            friends={acceptedFriends}
            showFriendFilter={viewMode === 'vetements-amis'}
          >
            <SearchFilterBar />
          </SearchFilterProvider>
          
          <CategoryTabs 
            categories={categories}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          >
            <VetementsList 
              vetements={filteredVetements}
              isLoading={isLoading || loadingAmis}
              error={error}
              isAuthenticated={!!user}
              onVetementDeleted={handleVetementDeleted}
              showOwner={viewMode === 'vetements-amis'}
            />
          </CategoryTabs>
        </>
      )}
    </>
  );
};

export default VetementsContainer;
