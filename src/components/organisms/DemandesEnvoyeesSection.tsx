
import React from "react";
import { Heading } from "@/components/atoms/Typography";
import DemandesEnvoyeesCard from "@/components/molecules/DemandesEnvoyeesCard";
import { Ami } from "@/services/amis/types";
import DemandesEnvoyeesListItem from "@/components/molecules/DemandesEnvoyeesListItem";
import { Clock } from "lucide-react";

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
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-amber-500" />
        <Heading as="h2" variant="h3">
          Demandes d'amis envoyées ({demandes.length})
        </Heading>
      </div>
      
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
    </section>
  );
};

export default DemandesEnvoyeesSection;
