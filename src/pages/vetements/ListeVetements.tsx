
import React from "react";
import { Helmet } from "react-helmet";
import Layout from "@/components/templates/Layout";
import { useAuth } from "@/contexts/AuthContext";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import VetementsContainer from "@/components/vetements/VetementsContainer";
import { TabsContent } from "@/components/ui/tabs";
import MesVetementsTab from "@/components/vetements/tabs/MesVetementsTab";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import MesEnsembles from "../ensembles/MesEnsembles";
import { useCategories } from "@/hooks/useCategories";

const ListeVetements = () => {
  const { user } = useAuth();
  const { filteredAmis, loadingAmis } = useAmis();
  
  const {
    searchTerm,
    setSearchTerm,
    categorieFilter,
    setCategorieFilter,
    marqueFilter,
    setMarqueFilter,
    friendFilter,
    setFriendFilter,
    viewMode,
    handleViewModeChange,
    filterVetements,
    activeTab,
    setActiveTab
  } = useVetementsFilters();

  // Récupération des catégories directement de la base de données
  const { categories: dbCategories, loadingCategories } = useCategories();

  const {
    vetements,
    categories,
    marques,
    isLoading,
    error,
    reloadVetements
  } = useVetementsData(viewMode, friendFilter);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];
  
  // Utiliser les catégories de la base de données pour le filtrage
  const filteredVetements = filterVetements(vetements, dbCategories.length ? dbCategories : categories);

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
    reloadVetements();
  };

  // S'assurer que les marques sont au bon format pour le SearchFilterProvider
  const marquesFormatted = marques.map ? marques.map(m => typeof m === 'string' ? m : m.nom) : [];

  return (
    <Layout>
      <Helmet>
        <title>Liste des vêtements | Garde-Robe</title>
        <meta name="description" content="Consultez tous vos vêtements et gérez votre collection" />
      </Helmet>

      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
        hideHeading={true}
      />

      <div className="container mx-auto px-4 py-8">
        <SearchFilterProvider
          categories={dbCategories.length ? dbCategories : categories}
          marques={marquesFormatted}
          friends={acceptedFriends}
          showFriendFilter={false}
        >
          <VetementsContainer defaultTab="mes-vetements">
            <TabsContent value="mes-vetements">
              <MesVetementsTab 
                vetements={filteredVetements}
                categories={dbCategories.length ? dbCategories : categories}
                marques={marquesFormatted}
                acceptedFriends={acceptedFriends}
                isLoading={isLoading || loadingAmis || loadingCategories}
                error={error}
                isAuthenticated={!!user}
                onVetementDeleted={handleVetementDeleted}
                hideTitle={true}
              />
            </TabsContent>
            
            <TabsContent value="mes-ensembles">
              <MesEnsembles asTabContent={true} />
            </TabsContent>
          </VetementsContainer>
        </SearchFilterProvider>
      </div>
    </Layout>
  );
};

export default ListeVetements;
