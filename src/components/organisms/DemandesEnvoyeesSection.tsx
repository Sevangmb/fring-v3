
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import DemandesEnvoyeesCard from "@/components/molecules/DemandesEnvoyeesCard";
import { Ami } from "@/services/amis/types";

interface DemandesEnvoyeesSectionProps {
  demandes: Ami[];
  onAnnuler: (id: number) => Promise<void>;
}

const DemandesEnvoyeesSection: React.FC<DemandesEnvoyeesSectionProps> = ({ 
  demandes, 
  onAnnuler 
}) => {
  return (
    <div>
      <Heading as="h2" variant="h3" className="mb-4">Demandes d'amis envoyées</Heading>
      {demandes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demandes.map((demande) => (
            <DemandesEnvoyeesCard 
              key={demande.id} 
              demande={demande} 
              onAnnuler={onAnnuler} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg shadow-sm p-6 border">
          <Text className="font-medium mb-2">Aucune demande envoyée</Text>
          <Text variant="small" className="text-muted-foreground">
            Vous n'avez pas envoyé de demande d'ami.
          </Text>
        </div>
      )}
    </div>
  );
};

export default DemandesEnvoyeesSection;
