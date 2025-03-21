
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import DemandesRecuesCard from "@/components/molecules/DemandesRecuesCard";
import { Ami } from "@/services/amiService";

interface DemandesRecuesSectionProps {
  demandes: Ami[];
  onAccepter: (id: number) => Promise<void>;
  onRejeter: (id: number) => Promise<void>;
}

const DemandesRecuesSection: React.FC<DemandesRecuesSectionProps> = ({ 
  demandes, 
  onAccepter, 
  onRejeter 
}) => {
  return (
    <div>
      <Heading as="h2" variant="h3" className="mb-4">Demandes d'amis reçues</Heading>
      {demandes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demandes.map((demande) => (
            <DemandesRecuesCard 
              key={demande.id} 
              demande={demande} 
              onAccepter={onAccepter} 
              onRejeter={onRejeter} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <Text className="font-medium mb-2">Aucune demande reçue</Text>
          <Text variant="small" className="text-muted-foreground">
            Vous n'avez pas de demande d'ami en attente.
          </Text>
        </div>
      )}
    </div>
  );
};

export default DemandesRecuesSection;
