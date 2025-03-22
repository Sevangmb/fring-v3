
import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFavoris } from "@/hooks/useFavoris";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MesFavorisTab: React.FC = () => {
  const { favoris, loading } = useFavoris();
  const [activeTab, setActiveTab] = useState<string>("all");
  const navigate = useNavigate();

  // Filtrer les favoris selon l'onglet actif
  const filteredFavoris = React.useMemo(() => {
    if (activeTab === "all") return favoris;
    return favoris.filter(f => f.type_favori === activeTab);
  }, [favoris, activeTab]);

  // Gérer la navigation lors du clic sur un favori
  const handleFavoriClick = (favori: any) => {
    if (favori.type_favori === 'vetement') {
      navigate(`/mes-vetements/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'ensemble') {
      navigate(`/ensembles/modifier/${favori.element_id}`);
    } else if (favori.type_favori === 'utilisateur') {
      navigate(`/messages/${favori.element_id}`);
    }
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
                {filteredFavoris.map((favori) => (
                  <Card 
                    key={favori.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleFavoriClick(favori)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          favori.type_favori === 'vetement' 
                            ? 'bg-blue-500' 
                            : favori.type_favori === 'ensemble' 
                              ? 'bg-green-500' 
                              : 'bg-purple-500'
                        }`} />
                        <span className="text-xs text-muted-foreground capitalize">
                          {favori.type_favori}
                        </span>
                      </div>
                      
                      <h3 className="font-medium mt-2 line-clamp-1">{favori.nom || "Sans nom"}</h3>
                      
                      {favori.details ? (
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
                      ) : (
                        <p className="mt-2 text-sm text-muted-foreground italic">
                          Élément supprimé ou indisponible
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default MesFavorisTab;
