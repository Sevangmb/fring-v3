
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Clock } from "lucide-react";
import AmisAcceptesSection from "@/components/organisms/AmisAcceptesSection";
import DemandesRecuesSection from "@/components/organisms/DemandesRecuesSection";
import DemandesEnvoyeesSection from "@/components/organisms/DemandesEnvoyeesSection";
import { Ami } from "@/services/amis/types";

interface AmisTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  amisAcceptes: Ami[];
  demandesRecues: Ami[];
  demandesEnvoyees: Ami[];
  viewMode: "grid" | "list";
  onAccepterDemande: (id: number) => Promise<void>;
  onRejeterDemande: (id: number) => Promise<void>;
}

const AmisTabs: React.FC<AmisTabsProps> = ({
  activeTab,
  onTabChange,
  amisAcceptes,
  demandesRecues,
  demandesEnvoyees,
  viewMode,
  onAccepterDemande,
  onRejeterDemande
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="w-full md:w-auto justify-start mb-4 bg-transparent p-0 space-x-4">
        <TabsTrigger 
          value="amis" 
          className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
        >
          <Users className="h-4 w-4 mr-2" />
          Mes amis ({amisAcceptes.length})
        </TabsTrigger>
        
        <TabsTrigger 
          value="demandes-recues" 
          className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground relative"
        >
          Demandes reçues
          {demandesRecues.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {demandesRecues.length}
            </span>
          )}
        </TabsTrigger>
        
        <TabsTrigger 
          value="demandes-envoyees" 
          className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground relative"
        >
          <Clock className="h-4 w-4 mr-2" />
          Demandes envoyées
          {demandesEnvoyees.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {demandesEnvoyees.length}
            </span>
          )}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="amis" className="mt-4">
        <AmisAcceptesSection 
          amis={amisAcceptes} 
          onRetirer={onRejeterDemande}
          viewMode={viewMode}
        />
      </TabsContent>

      <TabsContent value="demandes-recues" className="mt-4">
        {demandesRecues.length > 0 ? (
          <DemandesRecuesSection 
            demandes={demandesRecues} 
            onAccepter={onAccepterDemande}
            onRejeter={onRejeterDemande}
            viewMode={viewMode}
          />
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Aucune demande reçue</h3>
            <p className="text-muted-foreground mt-2">
              Vous n'avez pas de demandes d'amis en attente.
            </p>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="demandes-envoyees" className="mt-4">
        {demandesEnvoyees.length > 0 ? (
          <DemandesEnvoyeesSection 
            demandes={demandesEnvoyees} 
            onAnnuler={onRejeterDemande}
            viewMode={viewMode}
          />
        ) : (
          <div className="text-center py-12 bg-muted/30 rounded-lg border">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-4">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-medium">Aucune demande envoyée</h3>
            <p className="text-muted-foreground mt-2">
              Vous n'avez pas envoyé de demandes d'amis.
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default AmisTabs;
