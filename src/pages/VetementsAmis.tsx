
import React from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import VetementsList from "@/components/organisms/VetementsList";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";

const VetementsAmis = () => {
  const { user, loading } = useAuth();
  const { filteredAmis, loadingAmis, chargerAmis } = useAmis();
  const {
    activeTab,
    setActiveTab,
    friendFilter,
    setFriendFilter,
    filterVetements
  } = useVetementsFilters();

  const {
    vetements,
    categories,
    marques,
    isLoading,
    error,
    reloadVetements
  } = useVetementsData('vetements-amis', friendFilter);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];

  // Charger les amis au montage du composant
  React.useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  const filteredVetements = filterVetements(vetements, categories);

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
    reloadVetements();
  };

  // Cette fonction est appelée lorsqu'un ami est sélectionné dans le filtre
  const handleFriendFilterChange = (friendId: string) => {
    console.log("Changement de filtre ami:", friendId);
    setFriendFilter(friendId);
    // Force le rechargement des vêtements avec le nouveau filtre ami
    reloadVetements();
  };

  return (
    <Layout>
      <Helmet>
        <title>Vêtements des Amis | Garde-Robe</title>
        <meta name="description" content="Consultez les vêtements de vos amis" />
      </Helmet>

      <AmisPageHeader user={user} loading={loading} />
      
      {user && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Vêtements de mes amis</h1>
            
            <SearchFilterProvider
              categories={categories}
              marques={marques.map(m => m.nom)}
              friends={acceptedFriends}
              showFriendFilter={true}
              onFriendFilterChange={handleFriendFilterChange}
              currentFriendFilter={friendFilter}
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
                showOwner={true}
              />
            </CategoryTabs>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VetementsAmis;
