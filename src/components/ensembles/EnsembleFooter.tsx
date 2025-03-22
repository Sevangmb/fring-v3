
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, TagIcon } from 'lucide-react';

interface EnsembleFooterProps {
  created_at: string;
  occasion?: string;
  saison?: string;
}

const EnsembleFooter: React.FC<EnsembleFooterProps> = ({ created_at, occasion, saison }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="flex items-center space-x-1 text-xs text-muted-foreground">
        <CalendarIcon size={12} />
        <span>Créé le {formatDate(created_at)}</span>
      </div>
      
      {(occasion || saison) && (
        <div className="flex flex-wrap gap-1 mt-1">
          {occasion && (
            <Badge variant="outline" className="text-xs py-0">
              <TagIcon size={10} className="mr-1" />
              {occasion}
            </Badge>
          )}
          {saison && (
            <Badge variant="outline" className="text-xs py-0">
              <TagIcon size={10} className="mr-1" />
              {saison}
            </Badge>
          )}
        </div>
      )}
    </>
  );
};

export default EnsembleFooter;
