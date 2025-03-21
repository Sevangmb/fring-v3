import React, { useEffect, useState } from "react";
import Layout from "@/components/templates/Layout";
import { useToast } from "@/hooks/use-toast";
import { fetchVetements, fetchVetementsAmis, Vetement } from "@/services/vetement";
import { fetchCategories, Categorie } from "@/services/categorieService";
import { fetchMarques, Marque } from "@/services/marqueService";
import { useAuth } from "@/contexts/AuthContext";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import VetementsPageHeader from "@/components/molecules/VetementsPageHeader";
import ViewModeSelector from "@/components/molecules/ViewModeSelector";
import FloatingAddButton from "@/components/molecules/FloatingAddButton";
import { useAmis } from "@/hooks/useAmis";
import { Ami } from "@/services/amis";

const ListeVetementsPage = () => {
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("");
  const [marqueFilter, setMarqueFilter] = useState<string>("");
  const [friendFilter, setFriendFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tous");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis'>('mes-vetements');
  const [error, setError] = useState<string | null>(null);
  const { filteredAmis, loadingAmis } = useAmis();
  const [selectedFriendEmail, setSelectedFriendEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Chargement des données pour l'utilisateur:", user.id);
        
        const [categoriesData, marquesData] = await Promise.all([
          fetchCategories(),
          fetchMarques()
        ]);
        
        let vetementsData: Vetement[] = [];
        if (viewMode === 'mes-vetements') {
          vetementsData = await fetchVetements();
        } else {
          const friendIdParam = friendFilter !== "all" ? friendFilter : undefined;
          vetementsData = await fetchVetementsAmis(friendIdParam);
          
          if (friendFilter !== "all") {
            const selectedFriend = acceptedFriends.find(ami => 
              (ami.user_id === ami.ami_id ? ami.ami_id : ami.user_id) === friendFilter
            );
            setSelectedFriendEmail(selectedFriend?.email);
          } else {
            setSelectedFriendEmail(undefined);
          }
        }
        
        console.log("Vêtements récupérés:", vetementsData.length);
        console.log("Catégories récupérées:", categoriesData.length);
        console.log("Marques récupérées:", marquesData.length);
        
        setVetements(vetementsData);
        setCategories(categoriesData);
        setMarques(marquesData);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger les données. Veuillez réessayer.");
        toast({
          title: "Erreur",
          description: "Impossible de charger les données.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!authLoading) {
      loadData();
    }
  }, [user, authLoading, toast, viewMode, friendFilter]);

  const acceptedFriends = filteredAmis?.amisAcceptes || [];

  const getCategoryNameById = (categoryId: number): string => {
    const category = categories.find(cat => Number(cat.id) === categoryId);
    return category ? category.nom : 'Catégorie inconnue';
  };

  const filteredVetements = vetements.filter(vetement => {
    const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.owner_email && vetement.owner_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategorie = categorieFilter 
      ? categorieFilter === "all" 
        ? true 
        : getCategoryNameById(vetement.categorie_id) === categorieFilter 
      : true;
    
    const matchesMarque = marqueFilter ? marqueFilter === "all" ? true : vetement.marque === marqueFilter : true;
    
    if (activeTab === "tous") {
      return matchesSearch && matchesCategorie && matchesMarque;
    } else {
      return matchesSearch && matchesCategorie && matchesMarque && getCategoryNameById(vetement.categorie_id) === activeTab;
    }
  });

  const handleVetementDeleted = (id: number) => {
    setVetements(vetements.filter(v => v.id !== id));
  };

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis') => {
    setViewMode(mode);
    setActiveTab("tous");
    setSearchTerm("");
    setCategorieFilter("");
    setMarqueFilter("");
    setFriendFilter("all");
  };

  return (
    <Layout>
      <VetementsPageHeader 
        isAuthenticated={!!user} 
        viewMode={viewMode}
        selectedFriendEmail={selectedFriendEmail}
      />
      
      <div className="container mx-auto px-4 py-8">
        {user && (
          <>
            <ViewModeSelector 
              viewMode={viewMode}
              onViewModeChange={handleViewModeChange}
            />

            <SearchFilterBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categorieFilter={categorieFilter}
              setCategorieFilter={setCategorieFilter}
              marqueFilter={marqueFilter}
              setMarqueFilter={setMarqueFilter}
              categories={categories}
              marques={marques}
              showFriendFilter={viewMode === 'vetements-amis'}
              friendFilter={friendFilter}
              setFriendFilter={setFriendFilter}
              friends={acceptedFriends}
            />
            
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
        )}
        
        {!user && !isLoading && (
          <VetementsList 
            vetements={[]}
            isLoading={false}
            error={null}
            isAuthenticated={false}
            onVetementDeleted={() => {}}
            showOwner={false}
          />
        )}
      </div>
    </Layout>
  );
};

export default ListeVetementsPage;
