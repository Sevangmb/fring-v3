
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/molecules/Card";
import { Shirt, Plus, Search, ArrowLeft, Filter, SlidersHorizontal, TagIcon, Edit, Trash2, LogIn } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchVetements, fetchCategories, fetchMarques,
  deleteVetement, Vetement, Categorie, Marque 
} from "@/services/supabaseService";
import { useAuth } from "@/contexts/AuthContext";

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

  // Récupérer les vêtements, catégories et marques depuis Supabase
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Récupérer les données depuis notre service
        const [vetementsData, categoriesData, marquesData] = await Promise.all([
          fetchVetements(),
          fetchCategories(),
          fetchMarques()
        ]);
        
        setVetements(vetementsData);
        setCategories(categoriesData);
        setMarques(marquesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
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
  }, [user, authLoading, toast]);

  // Filtrer les vêtements en fonction de la recherche et des filtres
  const filteredVetements = vetements.filter(vetement => {
    // Filtre de recherche
    const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
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

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce vêtement ?")) {
      try {
        // Utiliser notre service pour supprimer le vêtement
        await deleteVetement(id);
        
        // Mettre à jour l'état local
        setVetements(vetements.filter(v => v.id !== id));
        
        toast({
          title: "Vêtement supprimé",
          description: "Le vêtement a été supprimé avec succès.",
        });
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer ce vêtement.",
          variant: "destructive",
        });
      }
    }
  };

  // Composant pour afficher la liste des vêtements (utilisé dans plusieurs onglets)
  const VetementsList = () => {
    if (!user) {
      return (
        <div className="text-center py-16">
          <Shirt size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
          <Heading as="h3" variant="h4" className="mb-2">Connectez-vous pour voir vos vêtements</Heading>
          <Text className="text-muted-foreground mb-6">
            Vous devez être connecté pour accéder à votre collection de vêtements.
          </Text>
          <Button onClick={() => navigate("/login")}>
            <LogIn className="mr-2 h-4 w-4" />
            Se connecter
          </Button>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-[300px] bg-muted/30 animate-pulse rounded-lg"></div>
          ))}
        </div>
      );
    }
    
    if (filteredVetements.length === 0) {
      return (
        <div className="text-center py-16">
          <Shirt size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
          <Heading as="h3" variant="h4" className="mb-2">Aucun vêtement trouvé</Heading>
          <Text className="text-muted-foreground mb-6">
            {searchTerm || categorieFilter || marqueFilter
              ? "Aucun vêtement ne correspond à vos critères de recherche."
              : "Vous n'avez pas encore ajouté de vêtements à votre collection."}
          </Text>
          <Button onClick={() => navigate("/mes-vetements/ajouter")}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un vêtement
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredVetements.map((vetement) => (
          <Card key={vetement.id} className="overflow-hidden h-full flex flex-col" hoverable>
            {/* Image du vêtement (fallback si pas d'image) */}
            <div className="aspect-square bg-muted/20 relative">
              {vetement.image_url ? (
                <img 
                  src={vetement.image_url} 
                  alt={vetement.nom} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Shirt size={64} className="text-muted-foreground opacity-20" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="h-7 w-7 bg-background/80 backdrop-blur-sm"
                  onClick={() => {
                    // À implémenter: édition du vêtement
                    toast({
                      title: "Fonctionnalité à venir",
                      description: "L'édition des vêtements sera bientôt disponible.",
                    });
                  }}
                >
                  <Edit size={14} />
                </Button>
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-7 w-7 bg-destructive/80 backdrop-blur-sm"
                  onClick={() => handleDelete(vetement.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            
            <CardHeader className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <TagIcon size={16} className="text-muted-foreground" />
                <Text variant="subtle" className="capitalize">
                  {vetement.categorie}
                </Text>
              </div>
              <CardTitle className="line-clamp-1">{vetement.nom}</CardTitle>
              {vetement.marque && (
                <CardDescription className="line-clamp-1">
                  {vetement.marque}
                </CardDescription>
              )}
            </CardHeader>
            
            <CardFooter className="flex justify-between items-center pt-0 pb-4 px-6">
              <div className="flex items-center gap-2">
                <div 
                  className="h-4 w-4 rounded-full" 
                  style={{ 
                    backgroundColor: 
                      vetement.couleur === "blanc" ? "#f8fafc" :
                      vetement.couleur === "noir" ? "#1e293b" :
                      vetement.couleur === "gris" ? "#94a3b8" :
                      vetement.couleur === "bleu" ? "#3b82f6" :
                      vetement.couleur === "rouge" ? "#ef4444" :
                      vetement.couleur === "vert" ? "#22c55e" :
                      vetement.couleur === "jaune" ? "#eab308" :
                      vetement.couleur === "orange" ? "#f97316" :
                      vetement.couleur === "violet" ? "#a855f7" :
                      vetement.couleur === "rose" ? "#ec4899" :
                      vetement.couleur === "marron" ? "#78350f" :
                      vetement.couleur === "beige" ? "#ede9d9" :
                      "#cbd5e1", // fallback pour multicolore
                  }}
                />
                <Text variant="subtle" className="capitalize">
                  {vetement.couleur}
                </Text>
              </div>
              <Text variant="subtle">
                Taille: <span className="font-medium">{vetement.taille}</span>
              </Text>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
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
              ? "Consultez tous vos vêtements et gérez votre collection." 
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
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Rechercher un vêtement..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Select value={categorieFilter} onValueChange={setCategorieFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Catégorie" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.nom}>
                        {cat.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={marqueFilter} onValueChange={setMarqueFilter}>
                  <SelectTrigger className="w-[180px]">
                    <div className="flex items-center">
                      <TagIcon className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Marque" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes</SelectItem>
                    {marques.map((marque) => (
                      <SelectItem key={marque.id} value={marque.nom}>
                        {marque.nom}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  variant="outline" 
                  className="flex items-center"
                  onClick={() => {
                    setSearchTerm("");
                    setCategorieFilter("");
                    setMarqueFilter("");
                  }}
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Réinitialiser
                </Button>
                
                <Button 
                  onClick={() => navigate("/mes-vetements/ajouter")}
                  className="hidden md:flex items-center"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </Button>
              </div>
            </div>
            
            {/* Onglets par catégorie */}
            <Tabs 
              defaultValue="tous" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="mb-4 flex flex-wrap">
                <TabsTrigger value="tous">Tous</TabsTrigger>
                {categories.slice(0, 6).map((cat) => (
                  <TabsTrigger key={cat.id} value={cat.nom}>
                    {cat.nom}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {/* Contenu des onglets */}
              <TabsContent value="tous" className="mt-0">
                <VetementsList />
              </TabsContent>
              
              {/* Contenu pour chaque catégorie d'onglet */}
              {categories.slice(0, 6).map((cat) => (
                <TabsContent key={cat.id} value={cat.nom} className="mt-0">
                  <VetementsList />
                </TabsContent>
              ))}
            </Tabs>
            
            {/* Bouton flottant pour mobile */}
            <div className="fixed bottom-6 right-6 md:hidden">
              <Button
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg"
                onClick={() => navigate("/mes-vetements/ajouter")}
              >
                <Plus size={24} />
              </Button>
            </div>
          </>
        )}
        
        {!user && !isLoading && (
          <VetementsList />
        )}
      </div>
    </Layout>
  );
};

export default ListeVetementsPage;
