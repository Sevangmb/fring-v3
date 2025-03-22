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
  return;
};
export default VetementsTabsList;