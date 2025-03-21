
import React from "react";
import { Ami } from "@/services/amis/types";
import DemandesRecuesCard from "@/components/molecules/DemandesRecuesCard";
import { Heading } from "@/components/atoms/Typography";

interface DemandesRecuesSectionProps {
  demandes: Ami[];
  onAccepter: (id: number) => Promise<void>;
  onRejeter: (id: number) => Promise<void>;
}

const DemandesRecuesSection: React.FC<DemandesRecuesSectionProps> = ({
  demandes,
  onAccepter,
  onRejeter,
}) => {
  if (!demandes.length) {
    return null;
  }

  return (
    <section>
      <Heading as="h2" className="text-xl font-bold mb-4">
        Demandes d'amis reçues ({demandes.length})
      </Heading>
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
    </section>
  );
};

export default DemandesRecuesSection;
