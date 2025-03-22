
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

const ListeVetements = () => {
  const { user } = useAuth();
  const { filteredAmis, loadingAmis } = useAmis();
  
  const {
    searchTerm,
    categorieFilter,
    marqueFilter,
    friendFilter,
    activeTab: categoryTab,
    setActiveTab: setCategoryTab,
    viewMode,
    filterVetements
  } = useVetementsFilters();

  const {
    vetements,
    categories,
    marques,
    isLoading,
    error,
    reloadVetements
  } = useVetementsData(viewMode, friendFilter);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];
  const filteredVetements = filterVetements(vetements, categories);

  const handleVetementDeleted = (id: number) => {
    console.log(`Vêtement ${id} supprimé`);
    reloadVetements();
  };

  return (
    <Layout>
      <Helmet>
        <title>Liste des vêtements | Garde-Robe</title>
        <meta name="description" content="Consultez tous vos vêtements et gérez votre collection" />
      </Helmet>

      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode="mes-vetements"
      />

      <div className="container mx-auto px-4 py-8">
        <VetementsContainer defaultTab="mes-vetements">
          <TabsContent value="mes-vetements">
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
          </TabsContent>
        </VetementsContainer>
      </div>
    </Layout>
  );
};

export default ListeVetements;
