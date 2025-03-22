
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Shirt, PlusCircle, Layers, Plus } from "lucide-react";
import { TabType, TabChangeHandler } from "../types/TabTypes";

interface VetementsTabsListProps {
  onTabChange?: TabChangeHandler;
  activeTab?: TabType | string;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange, activeTab }) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value as TabType);
    }
  };

  return (
    <TabsList className="w-full p-0 bg-transparent border-b rounded-none justify-start space-x-2">
      <TabsTrigger 
        value="mes-vetements" 
        onClick={() => handleTabChange("mes-vetements")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Shirt className="mr-2 h-4 w-4" />
        Mes Vêtements
      </TabsTrigger>
      <TabsTrigger 
        value="ajouter-vetement" 
        onClick={() => handleTabChange("ajouter-vetement")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Ajouter un vêtement
      </TabsTrigger>
      <TabsTrigger 
        value="mes-ensembles" 
        onClick={() => handleTabChange("mes-ensembles")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Layers className="mr-2 h-4 w-4" />
        Mes Tenues
      </TabsTrigger>
      <TabsTrigger 
        value="ajouter-ensemble" 
        onClick={() => handleTabChange("ajouter-ensemble")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Plus className="mr-2 h-4 w-4" />
        Ajouter une tenue
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
