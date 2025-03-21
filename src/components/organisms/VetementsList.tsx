
import React from 'react';
import { useNavigate } from "react-router-dom";
import { Heading, Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Shirt, Plus, LogIn, Users } from "lucide-react";
import VetementCard from '@/components/molecules/VetementCard';
import { Vetement, deleteVetement } from '@/services/vetement';
import { useToast } from "@/hooks/use-toast";

interface VetementsListProps {
  vetements: Vetement[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onVetementDeleted: (id: number) => void;
  showOwner?: boolean;
}

const VetementsList: React.FC<VetementsListProps> = ({ 
  vetements, 
  isLoading, 
  error, 
  isAuthenticated,
  onVetementDeleted,
  showOwner = false
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce vêtement ?")) {
      try {
        await deleteVetement(id);
        onVetementDeleted(id);
        
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

  // Vérifions qu'un utilisateur est connecté pour voir ses vêtements
  if (!isAuthenticated) {
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
  
  if (error) {
    return (
      <div className="text-center py-16">
        <Text className="text-destructive mb-4">{error}</Text>
        <Button onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    );
  }
  
  if (vetements.length === 0) {
    return (
      <div className="text-center py-16">
        {showOwner ? (
          <>
            <Users size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
            <Heading as="h3" variant="h4" className="mb-2">Aucun vêtement trouvé</Heading>
            <Text className="text-muted-foreground mb-6">
              Vos amis n'ont pas encore partagé de vêtements, ou vous n'avez pas encore d'amis.
            </Text>
            <Button onClick={() => navigate("/mes-amis")}>
              <Users className="mr-2 h-4 w-4" />
              Gérer mes amis
            </Button>
          </>
        ) : (
          <>
            <Shirt size={48} className="mx-auto text-muted-foreground opacity-20 mb-4" />
            <Heading as="h3" variant="h4" className="mb-2">Aucun vêtement trouvé</Heading>
            <Text className="text-muted-foreground mb-6">
              Vous n'avez pas encore ajouté de vêtements à votre collection.
            </Text>
            <Button onClick={() => navigate("/mes-vetements/ajouter")}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un vêtement
            </Button>
          </>
        )}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vetements.map((vetement) => (
        <VetementCard 
          key={vetement.id} 
          vetement={vetement} 
          onDelete={handleDelete}
          showOwner={showOwner}
        />
      ))}
    </div>
  );
};

export default VetementsList;
