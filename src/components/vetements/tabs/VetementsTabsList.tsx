import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shirt, Users, Layers, Bookmark } from 'lucide-react';

const VetementsTabsList: React.FC = () => {
  return (
    <TabsList className="w-full justify-start overflow-x-auto">
      <TabsTrigger value="mes-vetements" className="flex items-center">
        <Shirt className="h-4 w-4 mr-2" />
        Mes Vêtements
      </TabsTrigger>
      <TabsTrigger value="vetements-amis" className="flex items-center">
        <Users className="h-4 w-4 mr-2" />
        Vêtements Amis
      </TabsTrigger>
      <TabsTrigger value="mes-ensembles" className="flex items-center">
        <Layers className="h-4 w-4 mr-2" />
        Ensembles Amis
      </TabsTrigger>
      <TabsTrigger value="mes-favoris" className="flex items-center">
        <Bookmark className="h-4 w-4 mr-2" />
        Mes Favoris
      </TabsTrigger>
    </TabsList>
  );
};

export default VetementsTabsList;
