
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavoris } from "@/hooks/useFavoris";
import { Loader2, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const MesFavorisTab: React.FC = () => {
  const { favoris, loading, retirerFavori, loadFavoris } = useFavoris();
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Filtrer les favoris selon l'onglet actif
  const filteredFavoris = React.useMemo(() => {
    if (activeTab === "all") return favoris;
    return favoris.filter(f => f.type_favori === activeTab);
  }, [favoris, activeTab]);

  // Gérer la navigation lors du clic sur un favori
  const handleFavoriClick = (favori: any) => {
    if (!isElementAvailable(favori)) return; // Ne pas naviguer si l'élément a été supprimé

    if (favori.type_favori === 'vetement') {
      navigate(`/mes-vetements/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'ensemble') {
      navigate(`/ensembles/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'utilisateur') {
      navigate(`/messages/${favori.element_id}`);
    }
  };

  // Gérer la suppression d'un favori
  const handleRemoveFavori = async (e: React.MouseEvent, favori: any) => {
    e.stopPropagation(); // Empêcher la navigation

    try {
      await retirerFavori(favori.type_favori, favori.element_id);
      toast({
        title: "Favori supprimé",
        description: "L'élément a été retiré de vos favoris.",
        variant: "default",
      });
      loadFavoris(); // Rafraîchir la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer ce favori.",
        variant: "destructive",
      });
    }
  };

  // Fonction pour déterminer si un élément est réellement disponible
  const isElementAvailable = (favori: any) => {
    // Vérifier que details n'est pas null/undefined et contient des données
    return favori.details !== null && 
           favori.details !== undefined && 
           Object.keys(favori.details).length > 0;
  };

  return (
    <TabsContent value="mes-favoris" className="mt-6">
      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full justify-start">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="vetement">Vêtements</TabsTrigger>
              <TabsTrigger value="ensemble">Ensembles</TabsTrigger>
              <TabsTrigger value="utilisateur">Utilisateurs</TabsTrigger>
            </TabsList>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Chargement des favoris...</span>
              </div>
            ) : filteredFavoris.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  Vous n'avez pas encore de favoris{activeTab !== "all" ? ` de type ${activeTab}` : ""}.
                </p>
                <p className="text-sm">
                  Vous pouvez ajouter des éléments en favoris en cliquant sur l'icône ❤️ dans les listes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredFavoris.map((favori) => {
                  const elementAvailable = isElementAvailable(favori);
                  return (
                    <Card 
                      key={favori.id} 
                      className={`overflow-hidden transition-shadow ${elementAvailable ? 'cursor-pointer hover:shadow-md' : 'bg-muted/30'}`}
                      onClick={() => handleFavoriClick(favori)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              favori.type_favori === 'vetement' 
                                ? 'default' 
                                : favori.type_favori === 'ensemble' 
                                  ? 'secondary' 
                                  : 'outline'
                            }>
                              {favori.type_favori}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ID: {favori.element_id}
                          </span>
                        </div>
                        
                        {!elementAvailable ? (
                          <div className="mt-2 bg-muted/50 p-4 rounded-md">
                            <div className="flex items-center space-x-2 text-muted-foreground mb-2">
                              <AlertTriangle size={16} className="text-amber-500" />
                              <h3 className="font-medium">
                                {favori.type_favori === 'vetement' ? 'Vêtement supprimé' : 
                                 favori.type_favori === 'ensemble' ? 'Ensemble supprimé' : 
                                 'Utilisateur indisponible'}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              Élément supprimé ou indisponible
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="w-full flex items-center justify-center gap-2 mt-2"
                              onClick={(e) => handleRemoveFavori(e, favori)}
                            >
                              <Trash2 size={14} />
                              <span>Retirer des favoris</span>
                            </Button>
                          </div>
                        ) : (
                          <>
                            <h3 className="font-medium mt-2 line-clamp-1">{favori.nom || "Sans nom"}</h3>
                            
                            <div className="mt-2 text-sm text-muted-foreground">
                              {favori.type_favori === 'vetement' && (
                                <div className="flex flex-col">
                                  <span>Couleur: {favori.details.couleur}</span>
                                  <span>Taille: {favori.details.taille}</span>
                                </div>
                              )}
                              {favori.type_favori === 'ensemble' && (
                                <span>{favori.details.description || `Ensemble avec ${favori.details.vetements?.length || 0} vêtements`}</span>
                              )}
                              {favori.type_favori === 'utilisateur' && (
                                <span>{favori.details.email}</span>
                              )}
                            </div>
                            
                            <div className="mt-3 flex justify-end">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-destructive hover:text-destructive/90 p-0 h-auto"
                                onClick={(e) => handleRemoveFavori(e, favori)}
                              >
                                <Trash2 size={14} className="mr-1" />
                                <span className="text-xs">Retirer</span>
                              </Button>
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MesFavorisTab;
