
import React from "react";
import { TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@/components/ui/tabs";
import { Heart } from "lucide-react";
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
        value="mes-favoris" 
        onClick={() => handleTabChange("mes-favoris")}
        className="rounded-b-none border-b-2 pb-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
      >
        <Heart className="mr-2 h-4 w-4" />
        Mes Favoris
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
