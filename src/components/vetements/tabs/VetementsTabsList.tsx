
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Plus, FileText, FilePlus, Users, Layers } from "lucide-react";

interface VetementsTabsListProps {
  onTabChange: (value: string) => void;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange }) => {
  return (
    <TabsList className="w-full grid grid-cols-6">
      <TabsTrigger value="mes-vetements" className="flex items-center gap-2">
        <Shirt className="h-4 w-4" />
        Mes Vêtements
      </TabsTrigger>
      <TabsTrigger value="ajouter-vetement" className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Ajouter Vêtement
      </TabsTrigger>
      <TabsTrigger value="mes-tenues" className="flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Mes Tenues
      </TabsTrigger>
      <TabsTrigger value="ajouter-tenue" className="flex items-center gap-2">
        <FilePlus className="h-4 w-4" />
        Ajouter Tenue
      </TabsTrigger>
      <TabsTrigger value="vetements-amis" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Vêtements Amis
      </TabsTrigger>
      <TabsTrigger value="mes-ensembles" className="flex items-center gap-2">
        <Layers className="h-4 w-4" />
        Ensembles Amis
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
