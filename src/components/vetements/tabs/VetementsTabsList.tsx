
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Plus, Layers, PlusCircle } from "lucide-react";
import { TabType, TabChangeHandler } from "../types/TabTypes";

interface VetementsTabsListProps {
  onTabChange?: TabChangeHandler;
  activeTab?: TabType | string;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({
  onTabChange,
  activeTab
}) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value as TabType);
    }
  };

  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
      <TabsTrigger 
        value="mes-vetements" 
        onClick={() => handleTabChange("mes-vetements")}
        className="flex items-center"
      >
        <Shirt className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Mes Vêtements</span>
        <span className="inline md:hidden">Vêtements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-vetement" 
        onClick={() => handleTabChange("ajouter-vetement")}
        className="flex items-center"
      >
        <Plus className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Ajouter un Vêtement</span>
        <span className="inline md:hidden">Ajouter</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="mes-ensembles" 
        onClick={() => handleTabChange("mes-ensembles")}
        className="flex items-center"
      >
        <Layers className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Mes Ensembles</span>
        <span className="inline md:hidden">Ensembles</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-ensemble" 
        onClick={() => handleTabChange("ajouter-ensemble")}
        className="flex items-center"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        <span className="hidden md:inline">Ajouter un Ensemble</span>
        <span className="inline md:hidden">Ajouter</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
