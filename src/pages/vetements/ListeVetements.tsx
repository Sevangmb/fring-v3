import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/molecules/Card";
import { Shirt, Plus, Search, ArrowLeft, Filter, SlidersHorizontal, TagIcon, Edit, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { fetchVetements, deleteVetement, demoVetements, Vetement } from "@/services/supabaseService";

// Removing the local Vetement interface since we're now importing it from the service

const ListeVetementsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [vetements, setVetements] = useState<Vetement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categorieFilter, setCategorieFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("tous");

  // Récupérer les vêtements depuis Supabase
  useEffect(() => {
    const loadVetements = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données depuis notre service
        const data = await fetchVetements();
        setVetements(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des vêtements:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos vêtements. Utilisation des données de démonstration.",
          variant: "destructive",
        });
        
        // Utiliser les données de démonstration
        // Simuler des IDs et des dates pour les données de démo
        setVetements(demoVetements.map((v, index) => ({
          ...v,
          id: index + 1,
          created_at: new Date().toISOString()
        })));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVetements();
  }, [toast]);

  // Filtrer les vêtements en fonction de la recherche et des filtres
  const filteredVetements = vetements.filter(vetement => {
    // Filtre de recherche
    const matchesSearch = vetement.nom.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (vetement.marque && vetement.marque.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (vetement.description && vetement.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Filtre de catégorie
    const matchesCategorie = categorieFilter ? categorieFilter === "all" ? true : vetement.categorie === categorieFilter : true;
    
    // Filtre par onglet
    if (activeTab === "tous") {
      return matchesSearch && matchesCategorie;
    } else {
      return matchesSearch && matchesCategorie && vetement.categorie === activeTab;
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

  // Pour simplifier, ces catégories devraient correspondre à celles dans le formulaire d'ajout
  const categories = [
    { value: "t-shirt", label: "T-shirts" },
    { value: "chemise", label: "Chemises" },
    { value: "pantalon", label: "Pantalons" },
    { value: "jeans", label: "Jeans" },
    { value: "veste", label: "Vestes" },
    { value: "pull", label: "Pulls" },
    { value: "robe", label: "Robes" },
    { value: "jupe", label: "Jupes" },
    { value: "short", label: "Shorts" },
    { value: "manteau", label: "Manteaux" },
    { value: "chaussures", label: "Chaussures" },
    { value: "accessoire", label: "Accessoires" },
  ];

  // Composant pour afficher la liste des vêtements (utilisé dans plusieurs onglets)
  const VetementsList = () => {
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
            {searchTerm || categorieFilter 
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
            Consultez tous vos vêtements et gérez votre collection.
          </Text>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
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
          
          <div className="flex gap-2">
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
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
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
            <TabsTrigger value="t-shirt">T-shirts</TabsTrigger>
            <TabsTrigger value="chemise">Chemises</TabsTrigger>
            <TabsTrigger value="pantalon">Pantalons</TabsTrigger>
            <TabsTrigger value="jeans">Jeans</TabsTrigger>
            <TabsTrigger value="veste">Vestes</TabsTrigger>
            <TabsTrigger value="pull">Pulls</TabsTrigger>
          </TabsList>
          
          {/* Contenu des onglets */}
          <TabsContent value="tous" className="mt-0">
            <VetementsList />
          </TabsContent>
          
          {/* Contenu pour chaque catégorie d'onglet */}
          {categories.slice(0, 6).map((cat) => (
            <TabsContent key={cat.value} value={cat.value} className="mt-0">
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
      </div>
    </Layout>
  );
};

export default ListeVetementsPage;
