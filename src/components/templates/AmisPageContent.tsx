
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Search, 
  Users, 
  Layout, 
  LayoutList, 
  Filter 
} from "lucide-react";
import DemandesRecuesSection from "@/components/organisms/DemandesRecuesSection";
import DemandesEnvoyeesSection from "@/components/organisms/DemandesEnvoyeesSection";
import AmisAcceptesSection from "@/components/organisms/AmisAcceptesSection";
import AjouterAmiDialog from "@/components/molecules/AjouterAmiDialog";
import { Ami } from "@/services/amis/types";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("amis");

  // Filtrer les amis en fonction du terme de recherche
  const filteredAmisAcceptes = searchTerm 
    ? amisAcceptes.filter(ami => 
        ami.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : amisAcceptes;

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

  const showBadges = demandesRecues.length > 0 || demandesEnvoyees.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un ami..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-2">
          <div className="flex border rounded-md">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Layout className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>

          <Button onClick={() => setAjouterAmiDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Ajouter des amis
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full md:w-auto justify-start mb-4 bg-transparent p-0 space-x-4">
          <TabsTrigger 
            value="amis" 
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
          >
            <Users className="h-4 w-4 mr-2" />
            Mes amis ({amisAcceptes.length})
          </TabsTrigger>
          
          <TabsTrigger 
            value="demandes" 
            className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground relative"
          >
            Demandes
            {showBadges && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {demandesRecues.length + demandesEnvoyees.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="amis" className="mt-4">
          <AmisAcceptesSection 
            amis={filteredAmisAcceptes} 
            onRetirer={onRejeterDemande}
            viewMode={viewMode}
          />
        </TabsContent>

        <TabsContent value="demandes" className="mt-4 space-y-8">
          {demandesRecues.length > 0 && (
            <DemandesRecuesSection 
              demandes={demandesRecues} 
              onAccepter={onAccepterDemande}
              onRejeter={onRejeterDemande}
              viewMode={viewMode}
            />
          )}
          
          {demandesEnvoyees.length > 0 && (
            <DemandesEnvoyeesSection 
              demandes={demandesEnvoyees} 
              onAnnuler={onRejeterDemande}
              viewMode={viewMode}
            />
          )}
          
          {demandesRecues.length === 0 && demandesEnvoyees.length === 0 && (
            <div className="text-center py-12 bg-muted/30 rounded-lg border">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                <Users className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Aucune demande en attente</h3>
              <p className="text-muted-foreground mt-2">
                Vous n'avez pas de demandes d'amis en attente.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AjouterAmiDialog 
        open={ajouterAmiDialogOpen}
        onClose={() => setAjouterAmiDialogOpen(false)}
        onAmiAdded={onAmiAdded}
      />
    </div>
  );
};

export default AmisPageContent;
