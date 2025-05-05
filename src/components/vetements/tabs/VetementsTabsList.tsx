
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, PlusCircle, Users, ShoppingBag } from "lucide-react";
import { TabType } from "../types/TabTypes";

interface VetementsTabsListProps {
  onTabChange: (value: TabType) => void;
  activeTab: string;
}

const VetementsTabsList: React.FC<VetementsTabsListProps> = ({ onTabChange, activeTab }) => {
  return (
    <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-8">
      <TabsTrigger 
        value="mes-vetements" 
        onClick={() => onTabChange('mes-vetements')}
        className="flex items-center gap-2"
        data-state={activeTab === 'mes-vetements' ? 'active' : ''}
      >
        <Shirt className="h-4 w-4" />
        <span className="hidden sm:inline">Mes Vêtements</span>
        <span className="sm:hidden">Vêtements</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-vetement" 
        onClick={() => onTabChange('ajouter-vetement')}
        className="flex items-center gap-2"
        data-state={activeTab === 'ajouter-vetement' ? 'active' : ''}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Ajouter</span>
        <span className="sm:inline md:hidden">+</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="mes-ensembles" 
        onClick={() => onTabChange('mes-ensembles')}
        className="flex items-center gap-2"
        data-state={activeTab === 'mes-ensembles' ? 'active' : ''}
      >
        <ShoppingBag className="h-4 w-4" />
        <span className="hidden sm:inline">Mes Tenues</span>
        <span className="sm:hidden">Tenues</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ajouter-ensemble" 
        onClick={() => onTabChange('ajouter-ensemble')}
        className="flex items-center gap-2"
        data-state={activeTab === 'ajouter-ensemble' ? 'active' : ''}
      >
        <PlusCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Ajouter Tenue</span>
        <span className="sm:inline md:hidden">+</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="vetements-amis" 
        onClick={() => onTabChange('vetements-amis')}
        className="flex items-center gap-2"
        data-state={activeTab === 'vetements-amis' ? 'active' : ''}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Vêt. Amis</span>
        <span className="sm:hidden">Amis</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="ensembles-amis" 
        onClick={() => onTabChange('ensembles-amis')}
        className="flex items-center gap-2"
        data-state={activeTab === 'ensembles-amis' ? 'active' : ''}
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Ens. Amis</span>
        <span className="sm:hidden">Ens.</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
