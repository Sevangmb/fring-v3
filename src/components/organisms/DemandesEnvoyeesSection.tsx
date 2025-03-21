
import React from "react";
import { Heading, Text } from "@/components/atoms/Typography";
import DemandesEnvoyeesCard from "@/components/molecules/DemandesEnvoyeesCard";
import { Ami } from "@/services/amis/types";
import DemandesEnvoyeesListItem from "@/components/molecules/DemandesEnvoyeesListItem";

interface DemandesEnvoyeesSectionProps {
  demandes: Ami[];
  onAnnuler: (id: number) => Promise<void>;
  viewMode: "grid" | "list";
}

const DemandesEnvoyeesSection: React.FC<DemandesEnvoyeesSectionProps> = ({ 
  demandes, 
  onAnnuler,
  viewMode
}) => {
  if (!demandes.length) {
    return null;
  }

  return (
    <div>
      <Heading as="h2" variant="h3" className="mb-4">
        Demandes d'amis envoyées ({demandes.length})
      </Heading>
      
      {viewMode === "grid" ? (
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
        <div className="border rounded-md divide-y">
          {demandes.map((demande) => (
            <DemandesEnvoyeesListItem 
              key={demande.id} 
              demande={demande} 
              onAnnuler={onAnnuler} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DemandesEnvoyeesSection;
