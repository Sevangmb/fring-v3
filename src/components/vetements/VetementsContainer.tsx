
import React, { useEffect } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import ViewModeSelector from "@/components/molecules/ViewModeSelector";
import FloatingAddButton from "@/components/molecules/FloatingAddButton";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";

const VetementsContainer: React.FC = () => {
  const { user } = useAuth();
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
      <ViewModeSelector 
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
      />

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
      
      <FloatingAddButton visible={viewMode === 'mes-vetements'} />
    </>
  );
};

export default VetementsContainer;
