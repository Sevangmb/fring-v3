
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AjouterAmiDialog from "@/components/molecules/AjouterAmiDialog";
import { Ami } from "@/services/amis/types";
import AmisSearchBar from "@/components/molecules/AmisSearchBar";
import AmisTabs from "@/components/molecules/AmisTabs";
import { useAmisPageState } from "@/hooks/useAmisPageState";

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
  
  const {
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    filteredAmisAcceptes,
    filteredDemandesEnvoyees,
    filteredDemandesRecues
  } = useAmisPageState(demandesRecues, demandesEnvoyees, amisAcceptes);

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <AmisSearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <Button onClick={() => setAjouterAmiDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          Ajouter des amis
        </Button>
      </div>

      <AmisTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        amisAcceptes={filteredAmisAcceptes}
        demandesRecues={filteredDemandesRecues}
        demandesEnvoyees={filteredDemandesEnvoyees}
        viewMode={viewMode}
        onAccepterDemande={onAccepterDemande}
        onRejeterDemande={onRejeterDemande}
      />
      
      <AjouterAmiDialog 
        open={ajouterAmiDialogOpen}
        onClose={() => setAjouterAmiDialogOpen(false)}
        onAmiAdded={onAmiAdded}
      />
    </div>
  );
};

export default AmisPageContent;
