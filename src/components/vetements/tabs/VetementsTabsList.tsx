
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Plus, FileText, FilePlus } from "lucide-react";
import { TabType } from "../VetementsContainer";

interface VetementsTabsListProps {
  onTabChange: (value: string) => void;
  activeTab: string;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange, activeTab }) => {
  const handleTabChange = (value: string) => {
    onTabChange(value);
  };
  
  return (
    <TabsList className="w-full grid grid-cols-4">
      <TabsTrigger 
        value="mes-vetements" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange("mes-vetements")}
        data-state={activeTab === "mes-vetements" ? "active" : "inactive"}
      >
        <Shirt className="h-4 w-4" />
        Mes Vêtements
      </TabsTrigger>
      <TabsTrigger 
        value="ajouter-vetement" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange("ajouter-vetement")}
        data-state={activeTab === "ajouter-vetement" ? "active" : "inactive"}
      >
        <Plus className="h-4 w-4" />
        Ajouter Vêtement
      </TabsTrigger>
      <TabsTrigger 
        value="mes-tenues" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange("mes-tenues")}
        data-state={activeTab === "mes-tenues" ? "active" : "inactive"}
      >
        <FileText className="h-4 w-4" />
        Mes Tenues
      </TabsTrigger>
      <TabsTrigger 
        value="ajouter-tenue" 
        className="flex items-center gap-2"
        onClick={() => handleTabChange("ajouter-tenue")}
        data-state={activeTab === "ajouter-tenue" ? "active" : "inactive"}
      >
        <FilePlus className="h-4 w-4" />
        Ajouter Tenue
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
