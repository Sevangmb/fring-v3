
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, LogIn, Users, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchVetements, fetchVetementsAmis, Vetement, createDemoVetementsForUser
} from "@/services/vetementService";
import { fetchCategories, Categorie } from "@/services/categorieService";
import { fetchMarques, Marque } from "@/services/marqueService";
import { useAuth } from "@/contexts/AuthContext";
import VetementsList from "@/components/organisms/VetementsList";
import SearchFilterBar from "@/components/molecules/SearchFilterBar";
import CategoryTabs from "@/components/molecules/CategoryTabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ListeVetementsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [marques, setMarques] = useState<Marque[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("");
  const [marqueFilter, setMarqueFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tous");
  const [viewMode, setViewMode] = useState<'mes-vetements' | 'vetements-amis'>('mes-vetements');
  const [error, setError] = useState<string | null>(null);

  // Récupérer les vêtements, catégories et marques depuis Supabase
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
        
        // Récupérer les catégories et marques
        const [categoriesData, marquesData] = await Promise.all([
          fetchCategories(),
          fetchMarques()
        ]);
        
        // Récupérer les vêtements selon le mode d'affichage
        let vetementsData: Vetement[] = [];
        if (viewMode === 'mes-vetements') {
          vetementsData = await fetchVetements();
        } else {
          vetementsData = await fetchVetementsAmis();
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
  }, [user, authLoading, toast, viewMode]);

  // Filtrer les vêtements en fonction de la recherche et des filtres
  const filteredVetements = vetements.filter(vetement => {
    // Filtre de recherche
    const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.owner_email && vetement.owner_email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre de catégorie
    const matchesCategorie = categorieFilter ? categorieFilter === "all" ? true : vetement.categorie === categorieFilter : true;
    
    // Filtre de marque
    const matchesMarque = marqueFilter ? marqueFilter === "all" ? true : vetement.marque === marqueFilter : true;
    
    // Filtre par onglet
    if (activeTab === "tous") {
      return matchesSearch && matchesCategorie && matchesMarque;
    } else {
      return matchesSearch && matchesCategorie && matchesMarque && vetement.categorie === activeTab;
    }
  });

  const handleVetementDeleted = (id: number) => {
    setVetements(vetements.filter(v => v.id !== id));
  };

  const handleViewModeChange = (mode: 'mes-vetements' | 'vetements-amis') => {
    setViewMode(mode);
    // Réinitialiser les filtres lors du changement de mode
    setActiveTab("tous");
    setSearchTerm("");
    setCategorieFilter("");
    setMarqueFilter("");
  };

  return (
    <Layout>
      <div className="pt-24 pb-6 bg-accent/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/mes-vetements")}
              className="rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <Heading>Liste des vêtements</Heading>
          </div>
          <Text className="text-muted-foreground max-w-2xl mt-4">
            {user 
              ? viewMode === 'mes-vetements' 
                ? "Consultez tous vos vêtements et gérez votre collection."
                : "Parcourez les vêtements partagés par vos amis."
              : "Connectez-vous pour voir et gérer vos vêtements."}
          </Text>
          
          {!user && !authLoading && (
            <div className="mt-8">
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {user && (
          <>
            {/* Sélecteur de mode d'affichage */}
            <div className="mb-6">
              <Tabs 
                defaultValue="mes-vetements" 
                value={viewMode}
                onValueChange={(value) => handleViewModeChange(value as 'mes-vetements' | 'vetements-amis')}
                className="w-full"
              >
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
                  <TabsTrigger value="mes-vetements" className="flex items-center gap-2">
                    <User size={16} />
                    <span>Mes vêtements</span>
                  </TabsTrigger>
                  <TabsTrigger value="vetements-amis" className="flex items-center gap-2">
                    <Users size={16} />
                    <span>Vêtements de mes amis</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Barre de recherche et filtres */}
            <SearchFilterBar 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              categorieFilter={categorieFilter}
              setCategorieFilter={setCategorieFilter}
              marqueFilter={marqueFilter}
              setMarqueFilter={setMarqueFilter}
              categories={categories}
              marques={marques}
            />
            
            {/* Onglets par catégorie */}
            <CategoryTabs 
              categories={categories}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              <VetementsList 
                vetements={filteredVetements}
                isLoading={isLoading}
                error={error}
                isAuthenticated={!!user}
                onVetementDeleted={handleVetementDeleted}
                showOwner={viewMode === 'vetements-amis'}
              />
            </CategoryTabs>
            
            {/* Bouton flottant pour mobile - visible uniquement en mode "Mes vêtements" */}
            {viewMode === 'mes-vetements' && (
              <div className="fixed bottom-6 right-6 md:hidden">
                <Button
                  size="lg"
                  className="h-14 w-14 rounded-full shadow-lg"
                  onClick={() => navigate("/mes-vetements/ajouter")}
                >
                  <Plus size={24} />
                </Button>
              </div>
            )}
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
