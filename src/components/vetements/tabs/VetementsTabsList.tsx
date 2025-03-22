
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Users, ListPlus, List } from "lucide-react";

interface VetementsTabsListProps {
  onTabChange: (value: string) => void;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange }) => {
  return (
    <TabsList className="w-full grid grid-cols-4">
      <TabsTrigger value="mes-vetements" className="flex items-center gap-2">
        <Shirt className="h-4 w-4" />
        Mes Vêtements
      </TabsTrigger>
      <TabsTrigger value="vetements-amis" className="flex items-center gap-2">
        <Users className="h-4 w-4" />
        Vêtements Amis
      </TabsTrigger>
      <TabsTrigger value="ajouter-ensemble" className="flex items-center gap-2">
        <ListPlus className="h-4 w-4" />
        Ajouter Ensemble
      </TabsTrigger>
      <TabsTrigger value="mes-ensembles" className="flex items-center gap-2">
        <List className="h-4 w-4" />
        Ensembles Amis
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
