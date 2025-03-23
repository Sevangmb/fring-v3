
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Plus, Users, Layers, PlusCircle, Heart } from "lucide-react";
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
        value="ajouter" 
        onClick={() => handleTabChange("ajouter")}
        className="flex items-center gap-2"
        data-state={activeTab === "ajouter" ? "active" : "inactive"}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden md:inline">Ajouter</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="vetements-amis" 
        onClick={() => handleTabChange("vetements-amis")}
        className="flex items-center gap-2"
        data-state={activeTab === "vetements-amis" ? "active" : "inactive"}
      >
        <Users className="h-4 w-4" />
        <span className="hidden md:inline">Amis</span>
      </TabsTrigger>
    </TabsList>
  );
};
export default VetementsTabsList;
