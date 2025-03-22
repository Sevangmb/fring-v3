
import React, { useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import AmisPageHeader from "@/components/organisms/AmisPageHeader";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import VetementsList from "@/components/organisms/VetementsList";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import { toast } from "@/hooks/use-toast";

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

  // Effet pour débogage
  useEffect(() => {
    console.log("Filtre d'ami actuel dans VetementsAmis:", friendFilter);
    console.log("Nombre de vêtements affichés:", vetements.length);
    console.log("Amis acceptés:", acceptedFriends.length);
  }, [friendFilter, vetements, acceptedFriends]);

  // Effet pour afficher un message informatif si aucun vêtement n'est trouvé
  useEffect(() => {
    if (!isLoading && !loadingAmis && user) {
      const timeoutId = setTimeout(() => {
        if (vetements.length === 0) {
          if (friendFilter && friendFilter !== 'all') {
            toast({
              title: "Information",
              description: "Cet ami n'a pas encore partagé de vêtements.",
              variant: "default",
            });
          } else if (acceptedFriends.length === 0) {
            toast({
              title: "Information",
              description: "Vous n'avez pas encore d'amis acceptés. Ajoutez des amis pour voir leurs vêtements.",
              variant: "default",
            });
          } else if (acceptedFriends.length > 0) {
            toast({
              title: "Information",
              description: "Vos amis n'ont pas encore partagé de vêtements.",
              variant: "default",
            });
          }
        }
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [isLoading, loadingAmis, vetements.length, friendFilter, acceptedFriends.length, user]);

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

  // S'assurer que les marques sont au bon format
  const marquesFormatted = marques ? marques.map(m => typeof m === 'string' ? m : m.nom) : [];

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
              marques={marquesFormatted}
              friends={acceptedFriends}
              showFriendFilter={true}
              onFriendFilterChange={handleFriendFilterChange}
              currentFriendFilter={friendFilter}
            >
              <SearchFilterBar />
              
              <VetementsList 
                vetements={filteredVetements}
                isLoading={isLoading || loadingAmis}
                error={error}
                isAuthenticated={!!user}
                onVetementDeleted={handleVetementDeleted}
                showOwner={true}
              />
            </SearchFilterProvider>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default VetementsAmis;
