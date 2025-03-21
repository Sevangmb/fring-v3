
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import DemandesRecuesSection from "@/components/organisms/DemandesRecuesSection";
import DemandesEnvoyeesSection from "@/components/organisms/DemandesEnvoyeesSection";
import AmisAcceptesSection from "@/components/organisms/AmisAcceptesSection";
import AjouterAmiDialog from "@/components/molecules/AjouterAmiDialog";
import { Ami } from "@/services/amis/types";

interface AmisPageContentProps {
  loadingAmis: boolean;
  demandesRecues: Ami[];
  demandesEnvoyees: Ami[];
  amisAcceptes: Ami[];
  onAccepterDemande: (id: number) => Promise<void>;
  onRejeterDemande: (id: number) => Promise<void>;
  onAmiAdded: () => Promise<void>;
}

const AmisPageContent: React.FC<AmisPageContentProps> = ({
  loadingAmis,
  demandesRecues,
  demandesEnvoyees,
  amisAcceptes,
  onAccepterDemande,
  onRejeterDemande,
  onAmiAdded
}) => {
  const [ajouterAmiDialogOpen, setAjouterAmiDialogOpen] = useState(false);

  if (loadingAmis) {
    return (
      <div className="flex justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-20 w-64 bg-muted rounded-lg"></div>
          <div className="h-20 w-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <DemandesRecuesSection 
        demandes={demandesRecues} 
        onAccepter={onAccepterDemande}
        onRejeter={onRejeterDemande}
      />
      
      <DemandesEnvoyeesSection 
        demandes={demandesEnvoyees} 
        onAnnuler={onRejeterDemande}
      />
      
      <AmisAcceptesSection 
        amis={amisAcceptes} 
        onRetirer={onRejeterDemande}
      />

      <div className="flex justify-center mt-8">
        <Button onClick={() => setAjouterAmiDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter des amis
        </Button>
      </div>
      
      <AjouterAmiDialog 
        open={ajouterAmiDialogOpen}
        onClose={() => setAjouterAmiDialogOpen(false)}
        onAmiAdded={onAmiAdded}
      />
    </div>
  );
};

export default AmisPageContent;
