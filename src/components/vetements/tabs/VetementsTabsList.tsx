
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Plus, Layers, Users, PlusCircle } from "lucide-react";
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
    <TabsList className="grid grid-cols-4 w-full">
      <TabsTrigger 
        value="mes-vetements" 
        onClick={() => handleTabChange("mes-vetements")}
        className="flex items-center gap-2"
        data-state={activeTab === "mes-vetements" ? "active" : "inactive"}
      >
        <Shirt className="h-4 w-4" />
        <span className="hidden md:inline">Mes Vêtements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="mes-ensembles" 
        onClick={() => handleTabChange("mes-ensembles")}
        className="flex items-center gap-2"
        data-state={activeTab === "mes-ensembles" ? "active" : "inactive"}
      >
        <Layers className="h-4 w-4" />
        <span className="hidden md:inline">Mes Ensembles</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-vetement" 
        onClick={() => handleTabChange("ajouter-vetement")}
        className="flex items-center gap-2"
        data-state={activeTab === "ajouter-vetement" ? "active" : "inactive"}
      >
        <Plus className="h-4 w-4" />
        <span className="hidden md:inline">Ajouter Vêtement</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-ensemble" 
        onClick={() => handleTabChange("ajouter-ensemble")}
        className="flex items-center gap-2"
        data-state={activeTab === "ajouter-ensemble" ? "active" : "inactive"}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden md:inline">Ajouter Ensemble</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
