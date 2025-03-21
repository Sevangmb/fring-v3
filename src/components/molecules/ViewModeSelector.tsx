
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users } from "lucide-react";

interface ViewModeSelectorProps {
  viewMode: 'mes-vetements' | 'vetements-amis';
  onViewModeChange: (mode: 'mes-vetements' | 'vetements-amis') => void;
}

const ViewModeSelector: React.FC<ViewModeSelectorProps> = ({ 
  viewMode, 
  onViewModeChange 
}) => {
  return (
    <div className="mb-6">
      <Tabs 
        defaultValue="mes-vetements" 
        value={viewMode}
        onValueChange={(value) => onViewModeChange(value as 'mes-vetements' | 'vetements-amis')}
        className="w-full"
      >
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="mes-vetements" className="flex items-center gap-2">
            <User size={16} />
            <span>Mes vêtements</span>
          </TabsTrigger>
          <TabsTrigger value="vetements-amis" className="flex items-center gap-2">
            <Users size={16} />
            <span>Vêtements de mes amis</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ViewModeSelector;
