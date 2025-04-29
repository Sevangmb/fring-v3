
import React from 'react';
import { useNavigate } from "react-router-dom";
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/molecules/Card";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Shirt, Edit, Trash2, TagIcon, User, CircleDollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Vetement } from '@/services/vetement/types';
import { useVetements } from '@/hooks/useVetements';
import FavoriButton from '@/components/atoms/FavoriButton';

interface VetementCardProps {
  vetement: Vetement;
  onDelete: (id: number) => Promise<void>;
  showOwner?: boolean;
  showVenteInfo?: boolean;
}

const VetementCard: React.FC<VetementCardProps> = ({ vetement, onDelete, showOwner = false, showVenteInfo = false }) => {
  const navigate = useNavigate();
  const { categories, getCategoryNameById } = useVetements();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/mes-vetements/modifier/${vetement.id}`);
  };

  const handleDelete = async () => {
    try {
      await onDelete(vetement.id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Calculer le prix final avec réduction si applicable
  const calculerPrixFinal = () => {
    if (!vetement.prix_vente) return null;
    if (!vetement.promo_pourcentage) return vetement.prix_vente;
    
    const reduction = vetement.prix_vente * (vetement.promo_pourcentage / 100);
    return vetement.prix_vente - reduction;
  };

  // Calculer la marge si les deux prix sont disponibles
  const calculerMarge = () => {
    if (!vetement.prix_achat || !vetement.prix_vente) return null;
    return vetement.prix_vente - vetement.prix_achat;
  };

  const marge = calculerMarge();
  const prixFinal = calculerPrixFinal();
  const categoryName = getCategoryNameById(vetement.categorie_id);

  return (
    <div className="group relative h-full">
      <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow relative">
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          <FavoriButton 
            type="vetement" 
            elementId={vetement.id} 
            nom={vetement.nom}
          />
          {!showOwner && (
            <div className="flex items-center gap-1">
              <Button 
                variant="primary" 
                size="icon" 
                className="h-7 w-7 bg-theme-teal-dark text-white hover:bg-theme-teal-medium shadow-sm"
                onClick={handleEdit}
                title="Modifier"
              >
                <Edit size={14} />
              </Button>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-7 w-7"
                onClick={handleDelete}
                title="Supprimer"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          )}
        </div>
        
        {/* Indicateur "À vendre" */}
        {vetement.a_vendre && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-primary/80 text-primary-foreground backdrop-blur-sm">
              <CircleDollarSign className="h-3 w-3" />
              <span className="text-xs font-medium">À vendre</span>
            </Badge>
          </div>
        )}
        
        {/* Bouton modifier mobile - visible uniquement sur petits écrans */}
        {!showOwner && (
          <div className="sm:hidden absolute right-2 bottom-2 z-10">
            <Button
              variant="primary"
              size="sm"
              className="bg-theme-teal-dark text-white hover:bg-theme-teal-medium shadow"
              onClick={handleEdit}
            >
              <Edit className="mr-1 h-4 w-4" /> Modifier
            </Button>
          </div>
        )}
        
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
        </div>
        
        <CardHeader className="flex-grow">
          {showOwner && vetement.owner_email && (
            <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
              <User size={14} />
              <span className="truncate">{vetement.owner_email}</span>
            </div>
          )}
          <div className="flex items-center gap-2 mb-2">
            <TagIcon size={16} className="text-muted-foreground" />
            <Text variant="subtle" className="capitalize">
              {categoryName}
            </Text>
          </div>
          <CardTitle className="line-clamp-1">{vetement.nom}</CardTitle>
          {vetement.marque && (
            <CardDescription className="line-clamp-1">
              {vetement.marque}
            </CardDescription>
          )}

          {/* Informations de vente */}
          {(showVenteInfo || vetement.a_vendre) && vetement.prix_vente && (
            <div className="mt-3 space-y-1">
              <div className="flex items-center justify-between">
                <Text variant="subtle">Prix:</Text>
                <div className="flex items-center gap-2">
                  {vetement.promo_pourcentage ? (
                    <>
                      <Text className="line-through text-muted-foreground">
                        {vetement.prix_vente} €
                      </Text>
                      <Text className="font-semibold text-primary">
                        {prixFinal?.toFixed(2)} €
                      </Text>
                      <Badge variant="outline" className="ml-1">
                        -{vetement.promo_pourcentage}%
                      </Badge>
                    </>
                  ) : (
                    <Text className="font-semibold">{vetement.prix_vente} €</Text>
                  )}
                </div>
              </div>

              {marge !== null && (
                <div className="flex items-center justify-between text-xs">
                  <Text variant="subtle">Marge:</Text>
                  <Text className={marge > 0 ? "text-green-600" : "text-red-600"}>
                    {marge.toFixed(2)} €
                  </Text>
                </div>
              )}

              {vetement.etat && (
                <div className="flex items-center justify-between text-xs">
                  <Text variant="subtle">État:</Text>
                  <Badge variant="outline" className="capitalize">
                    {vetement.etat}
                  </Badge>
                </div>
              )}

              {vetement.disponibilite && vetement.disponibilite !== "disponible" && (
                <Badge 
                  className={`w-full justify-center mt-1 ${
                    vetement.disponibilite === "vendu" ? "bg-green-600" : "bg-amber-500"
                  }`}>
                  {vetement.disponibilite === "vendu" ? "Vendu" : "Réservé"}
                </Badge>
              )}
            </div>
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
          <Text variant="subtle">{vetement.taille}</Text>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VetementCard;
