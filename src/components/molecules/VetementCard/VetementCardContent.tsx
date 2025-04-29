
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { CircleDollarSign } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';

interface VetementCardContentProps {
  vetement: Vetement;
}

const VetementCardContent: React.FC<VetementCardContentProps> = ({ vetement }) => {
  return (
    <>
      {/* "À vendre" indicator */}
      {vetement.a_vendre && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="flex items-center gap-1 px-2 py-1 bg-primary/80 text-primary-foreground backdrop-blur-sm">
            <CircleDollarSign className="h-3 w-3" />
            <span className="text-xs font-medium">À vendre</span>
          </Badge>
        </div>
      )}
    </>
  );
};

export default VetementCardContent;
