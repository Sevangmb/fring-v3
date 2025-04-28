
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign, Tag, Info } from "lucide-react";
import VetementsList from '@/components/organisms/VetementsList';
import { useVetementsData } from '@/hooks/useVetementsData';

const AVendreTab: React.FC = () => {
  const { vetements, isLoading, error, isAuthenticated, handleVetementDeleted } = useVetementsData('a-vendre', '');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Mes vêtements à vendre</h2>
          <p className="text-muted-foreground">
            Gérez les vêtements que vous souhaitez mettre en vente
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
            <CircleDollarSign className="h-4 w-4" />
            <span>{vetements.length} article{vetements.length !== 1 ? 's' : ''}</span>
          </Badge>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center gap-3 p-4 bg-primary/5 border rounded-lg mb-6">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm">
            Les vêtements marqués à vendre seront visibles avec leurs informations de prix. Pour ajouter un vêtement à vendre, modifiez un vêtement existant et activez l'option "À vendre".
          </p>
        </div>
      </div>
      
      <VetementsList 
        vetements={vetements.filter(v => v.a_vendre)}
        isLoading={isLoading}
        error={error}
        isAuthenticated={isAuthenticated}
        onVetementDeleted={handleVetementDeleted}
        showVenteInfo={true}
      />
    </div>
  );
};

export default AVendreTab;
