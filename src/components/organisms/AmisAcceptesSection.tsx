
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import AmiCard from "@/components/molecules/AmiCard";
import { Ami } from "@/services/amis/types";
import { UsersRound } from "lucide-react";
import AmiListItem from "@/components/molecules/AmiListItem";

interface AmisAcceptesSectionProps {
  amis: Ami[];
  onRetirer: (id: number) => Promise<void>;
  viewMode: "grid" | "list";
}

const AmisAcceptesSection: React.FC<AmisAcceptesSectionProps> = ({ 
  amis, 
  onRetirer,
  viewMode
}) => {
  if (amis.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-8 border text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="rounded-full bg-muted p-4 w-16 h-16 flex items-center justify-center">
            <UsersRound className="h-8 w-8 text-muted-foreground" />
          </div>
          <Heading as="h3" variant="h4">Aucun ami pour le moment</Heading>
          <Text className="text-muted-foreground max-w-md">
            Commencez à ajouter des amis en utilisant le bouton "Ajouter des amis" en haut de la page.
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {amis.map((ami) => (
            <AmiCard 
              key={ami.id} 
              ami={ami} 
              onRetirer={onRetirer} 
            />
          ))}
        </div>
      ) : (
        <div className="border rounded-md divide-y">
          {amis.map((ami) => (
            <AmiListItem 
              key={ami.id} 
              ami={ami} 
              onRetirer={onRetirer} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AmisAcceptesSection;
