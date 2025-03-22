
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Shirt, PlusCircle, Layers, Star } from "lucide-react";
import { Link } from "react-router-dom";

export type TabType = 'mes-vetements' | 'ajouter-vetement' | 'mes-tenues' | 'ajouter-tenue' | 'mes-favoris';

interface VetementsTabsListProps {
  onTabChange?: (value: string) => void;
  activeTab?: TabType | string;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange, activeTab }) => {
  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
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
        value="vetements-amis" 
        onClick={() => handleTabChange("vetements-amis")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Shirt className="mr-2 h-4 w-4" />
        Vêtements Amis
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
        value="mes-favoris" 
        onClick={() => handleTabChange("mes-favoris")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Star className="mr-2 h-4 w-4" />
        Mes Favoris
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
