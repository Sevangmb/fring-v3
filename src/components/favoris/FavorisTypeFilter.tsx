
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FavorisTypeFilterProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const FavorisTypeFilter: React.FC<FavorisTypeFilterProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsList className="mb-4 w-full justify-start">
      <TabsTrigger value="all" onClick={() => onTabChange("all")}>
        Tous
      </TabsTrigger>
      <TabsTrigger value="vetement" onClick={() => onTabChange("vetement")}>
        Vêtements
      </TabsTrigger>
      <TabsTrigger value="ensemble" onClick={() => onTabChange("ensemble")}>
        Ensembles
      </TabsTrigger>
      <TabsTrigger value="utilisateur" onClick={() => onTabChange("utilisateur")}>
        Utilisateurs
      </TabsTrigger>
    </TabsList>
  );
};

export default FavorisTypeFilter;
