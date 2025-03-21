
import React from "react";
import { Ami } from "@/services/amis/types";
import DemandesRecuesCard from "@/components/molecules/DemandesRecuesCard";
import { Heading } from "@/components/atoms/Typography";
import DemandesRecuesListItem from "@/components/molecules/DemandesRecuesListItem";
import { UserPlus } from "lucide-react";

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
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="h-5 w-5 text-primary" />
        <Heading as="h2" variant="h3">
          Demandes d'amis reçues ({demandes.length})
        </Heading>
      </div>
      
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
