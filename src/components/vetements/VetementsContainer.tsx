
import React, { useEffect } from "react";
import { useVetementsData } from "@/hooks/useVetementsData";
import { useVetementsFilters } from "@/hooks/useVetementsFilters";
import { useAmis } from "@/hooks/useAmis";
import { useAuth } from "@/contexts/AuthContext";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { SearchFilterProvider } from "@/contexts/SearchFilterContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Shirt, Users, ListPlus, List } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";

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

        {/* Contenu pour l'onglet "Mes Vêtements" */}
        <TabsContent value="mes-vetements">
          <SearchFilterProvider
            categories={categories}
            marques={marques}
            friends={acceptedFriends}
            showFriendFilter={false}
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
              showOwner={false}
            />
          </CategoryTabs>
        </TabsContent>
        
        {/* Contenu pour l'onglet "Vêtements Amis" */}
        <TabsContent value="vetements-amis">
          <SearchFilterProvider
            categories={categories}
            marques={marques}
            friends={acceptedFriends}
            showFriendFilter={true}
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
        </TabsContent>
        
        {/* Contenu pour l'onglet "Ajouter Ensemble" */}
        <TabsContent value="ajouter-ensemble">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Ajouter un Ensemble</CardTitle>
              <CardDescription>Créez un nouvel ensemble à partir de vos vêtements.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ListPlus size={64} className="text-muted-foreground mb-4" />
              <Text className="text-center mb-6">La fonctionnalité d'ajout d'ensembles est en cours de développement.</Text>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contenu pour l'onglet "Mes Ensembles" */}
        <TabsContent value="mes-ensembles">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Mes Ensembles</CardTitle>
              <CardDescription>Gérez vos ensembles de vêtements.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <List size={64} className="text-muted-foreground mb-4" />
              <Text className="text-center">La fonctionnalité de gestion des ensembles est en cours de développement.</Text>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VetementsContainer;
