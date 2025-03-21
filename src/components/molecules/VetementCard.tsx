
import React from 'react';
import Card, { CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/molecules/Card";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Shirt, Edit, Trash2, TagIcon, User } from "lucide-react";
import { Vetement } from '@/services/vetementService';
import { useToast } from "@/hooks/use-toast";

interface VetementCardProps {
  vetement: Vetement;
  onDelete: (id: number) => Promise<void>;
  showOwner?: boolean;
}

const VetementCard: React.FC<VetementCardProps> = ({ vetement, onDelete, showOwner = false }) => {
  const { toast } = useToast();

  const handleEdit = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'édition des vêtements sera bientôt disponible.",
    });
  };

  const handleDelete = async () => {
    try {
      await onDelete(vetement.id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col" hoverable>
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
        {!showOwner && (
          <div className="absolute top-2 right-2 flex gap-1">
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-7 w-7 bg-background/80 backdrop-blur-sm"
              onClick={handleEdit}
            >
              <Edit size={14} />
            </Button>
            <Button 
              variant="destructive" 
              size="icon" 
              className="h-7 w-7 bg-destructive/80 backdrop-blur-sm"
              onClick={handleDelete}
            >
              <Trash2 size={14} />
            </Button>
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
  );
};

export default VetementCard;
