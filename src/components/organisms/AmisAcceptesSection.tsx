
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import AmiCard from "@/components/molecules/AmiCard";
import { Ami } from "@/services/amiService";

interface AmisAcceptesSectionProps {
  amis: Ami[];
  onRetirer: (id: number) => Promise<void>;
}

const AmisAcceptesSection: React.FC<AmisAcceptesSectionProps> = ({ 
  amis, 
  onRetirer 
}) => {
  return (
    <div>
      <Heading as="h2" variant="h3" className="mb-4">Mes amis</Heading>
      {amis.length > 0 ? (
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
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <Text className="font-medium mb-2">Aucun ami pour le moment</Text>
          <Text variant="small" className="text-muted-foreground">
            Commencez à ajouter des amis pour les voir apparaître ici.
          </Text>
        </div>
      )}
    </div>
  );
};

export default AmisAcceptesSection;
