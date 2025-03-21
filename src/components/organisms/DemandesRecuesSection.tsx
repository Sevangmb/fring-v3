
import React from "react";
import { Ami } from "@/services/amis/types";
import DemandesRecuesCard from "@/components/molecules/DemandesRecuesCard";
import { Heading } from "@/components/atoms/Typography";
import DemandesRecuesListItem from "@/components/molecules/DemandesRecuesListItem";

interface DemandesRecuesSectionProps {
  demandes: Ami[];
  onAccepter: (id: number) => Promise<void>;
  onRejeter: (id: number) => Promise<void>;
  viewMode: "grid" | "list";
}

const DemandesRecuesSection: React.FC<DemandesRecuesSectionProps> = ({
  demandes,
  onAccepter,
  onRejeter,
  viewMode
}) => {
  if (!demandes.length) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" className="text-xl font-bold mb-4">
        Demandes d'amis reçues ({demandes.length})
      </Heading>
      
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        <div className="border rounded-md divide-y">
          {demandes.map((demande) => (
            <DemandesRecuesListItem
              key={demande.id}
              demande={demande}
              onAccepter={onAccepter}
              onRejeter={onRejeter}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default DemandesRecuesSection;
