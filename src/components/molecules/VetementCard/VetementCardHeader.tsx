
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { Text } from "@/components/atoms/Typography";
import { User, TagIcon } from 'lucide-react';
import { Vetement } from '@/services/vetement/types';
import { useVetements } from '@/hooks/useVetements';

interface VetementCardHeaderProps {
  vetement: Vetement;
  showOwner?: boolean;
}

const VetementCardHeader: React.FC<VetementCardHeaderProps> = ({ 
  vetement,
  showOwner = false
}) => {
  const { getCategoryNameById } = useVetements();
  const categoryName = getCategoryNameById(vetement.categorie_id);
  
  return (
    <CardHeader className="flex-grow">
      {showOwner && vetement.owner_email && (
        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
          <User size={14} />
          <span className="truncate">{vetement.owner_email}</span>
        </div>
      )}
      <div className="flex items-center gap-2 mb-2">
        <TagIcon size={16} className="text-muted-foreground" />
        <Text variant="subtle" className="capitalize">
          {categoryName}
        </Text>
      </div>
      <CardTitle className="line-clamp-1">{vetement.nom}</CardTitle>
      {vetement.marque && (
        <CardDescription className="line-clamp-1">
          {vetement.marque}
        </CardDescription>
      )}
    </CardHeader>
  );
};

export default VetementCardHeader;
