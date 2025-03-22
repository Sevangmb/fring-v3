
import React, { useEffect } from "react";
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
import { supabase } from "@/lib/supabase";
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
  }, [friendFilter, vetements]);

  // Vérifier le statut d'amitié pour mieux déboguer et afficher une notification si nécessaire
  useEffect(() => {
    const checkFriendshipStatus = async () => {
      if (friendFilter && friendFilter !== 'all' && user) {
        try {
          console.log("Vérification du statut d'amitié pour:", friendFilter);
          
          const { data: sessionData } = await supabase.auth.getSession();
          const currentUserId = sessionData.session?.user?.id;
          
          if (!currentUserId) {
            console.error('Utilisateur non connecté');
            return;
          }
          
          const { data: amisData, error: amisError } = await supabase
            .from('amis')
            .select('*')
            .or(`(user_id.eq.${friendFilter}.and.ami_id.eq.${currentUserId}),(user_id.eq.${currentUserId}.and.ami_id.eq.${friendFilter})`)
            .eq('status', 'accepted')
            .maybeSingle();
            
          if (amisError) {
            console.error('Erreur lors de la vérification de l\'amitié:', amisError);
          }
          
          console.log('Statut d\'amitié avec', friendFilter, ':', amisData ? 'Accepté' : 'Non accepté ou inexistant');
          console.log('Données d\'amitié:', amisData);
          
          if (!amisData) {
            // Afficher un toast seulement si aucun vêtement n'est affiché
            if (vetements.length === 0) {
              toast({
                title: "Information",
                description: "Il semble que vous n'ayez pas d'amitié acceptée avec cet utilisateur ou qu'il n'a pas partagé de vêtements.",
                variant: "default",
              });
            }
          }
        } catch (error) {
          console.error("Erreur lors de la vérification du statut d'amitié:", error);
        }
      }
    };
    
    // Attendre un court instant pour que les vêtements soient chargés avant de vérifier
    const timeoutId = setTimeout(() => {
      checkFriendshipStatus();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [friendFilter, user, vetements.length]);

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
