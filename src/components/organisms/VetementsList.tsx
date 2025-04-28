
import React from 'react';
import VetementCard from '@/components/molecules/VetementCard';
import { Vetement } from '@/services/vetement';
import { Shirt, Plus, LogIn, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import EmptyStateMessage from '@/components/molecules/EmptyStateMessage';
import { useVetementOperations } from '@/hooks/useVetementOperations';

interface VetementsListProps {
  vetements: Vetement[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  onVetementDeleted: (id: number) => void;
  showOwner?: boolean;
  hideTitle?: boolean;
  showVenteInfo?: boolean;
}

const VetementsList: React.FC<VetementsListProps> = ({ 
  vetements, 
  isLoading, 
  error, 
  isAuthenticated,
  onVetementDeleted,
  showOwner = false,
  hideTitle = false,
  showVenteInfo = false
}) => {
  const { handleDelete, navigateToAdd, navigateToLogin, navigateToFriends } = useVetementOperations();

  const onDeleteVetement = async (id: number) => {
    const success = await handleDelete(id);
    if (success) {
      onVetementDeleted(id);
    }
  };

  // Non-authenticated state
  if (!isAuthenticated) {
    return (
      <EmptyStateMessage
        icon={<Shirt size={48} />}
        title="Connectez-vous pour voir vos vêtements"
        description="Vous devez être connecté pour accéder à votre collection de vêtements."
        buttonText="Se connecter"
        buttonIcon={<LogIn className="mr-2 h-4 w-4" />}
        onButtonClick={navigateToLogin}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="h-[300px] bg-muted/30 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }
  
  // Error state
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
  
  // Empty state for personal clothes
  if (vetements.length === 0 && !showOwner) {
    return (
      <EmptyStateMessage
        icon={<Shirt size={48} />}
        title="Aucun vêtement trouvé"
        description={showVenteInfo ? "Vous n'avez pas encore de vêtements à vendre." : "Vous n'avez pas encore ajouté de vêtements à votre collection."}
        buttonText="Ajouter un vêtement"
        buttonIcon={<Plus className="mr-2 h-4 w-4" />}
        onButtonClick={navigateToAdd}
      />
    );
  }
  
  // Empty state for friends' clothes
  if (vetements.length === 0 && showOwner) {
    return (
      <EmptyStateMessage
        icon={<Users size={48} />}
        title="Aucun vêtement trouvé"
        description="Vos amis n'ont pas encore partagé de vêtements, ou vous n'avez pas encore d'amis."
        buttonText="Gérer mes amis"
        buttonIcon={<Users className="mr-2 h-4 w-4" />}
        onButtonClick={navigateToFriends}
      />
    );
  }
  
  // Normal list rendering
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {vetements.map((vetement) => (
        <VetementCard 
          key={vetement.id} 
          vetement={vetement} 
          onDelete={onDeleteVetement}
          showOwner={showOwner}
          showVenteInfo={showVenteInfo}
        />
      ))}
    </div>
  );
};

export default VetementsList;
