
import React from 'react';
import { Vetement } from '@/services/vetement/types';
import VetementCardContainer from './VetementCardContainer';
import VetementCardImage from './VetementCardImage';
import VetementCardHeader from './VetementCardHeader';
import VetementCardContent from './VetementCardContent';
import VetementCardFooter from './VetementCardFooter';
import VetementCardActions from './VetementCardActions';
import VetementCardPricing from './VetementCardPricing';

interface VetementCardProps {
  vetement: Vetement;
  onDelete: (id: number) => Promise<void>;
  showOwner?: boolean;
  showVenteInfo?: boolean;
}

const VetementCard: React.FC<VetementCardProps> = ({ 
  vetement, 
  onDelete, 
  showOwner = false, 
  showVenteInfo = false 
}) => {
  // Calculate final price with discount if applicable
  const calculerPrixFinal = () => {
    if (!vetement.prix_vente) return null;
    if (!vetement.promo_pourcentage) return vetement.prix_vente;
    
    const reduction = vetement.prix_vente * (vetement.promo_pourcentage / 100);
    return vetement.prix_vente - reduction;
  };

  // Calculate margin if both prices are available
  const calculerMarge = () => {
    if (!vetement.prix_achat || !vetement.prix_vente) return null;
    return vetement.prix_vente - vetement.prix_achat;
  };

  const marge = calculerMarge();
  const prixFinal = calculerPrixFinal();
  
  return (
    <VetementCardContainer>
      <VetementCardActions 
        vetement={vetement} 
        onDelete={onDelete}
        showOwner={showOwner}
      />
      
      <VetementCardImage imageUrl={vetement.image_url} nom={vetement.nom} />
      
      <VetementCardHeader 
        vetement={vetement}
        showOwner={showOwner}
      />
      
      <VetementCardContent vetement={vetement} />
      
      {(showVenteInfo || vetement.a_vendre) && vetement.prix_vente && (
        <VetementCardPricing
          vetement={vetement}
          prixFinal={prixFinal}
          marge={marge}
        />
      )}
      
      <VetementCardFooter 
        couleur={vetement.couleur} 
        taille={vetement.taille} 
      />
    </VetementCardContainer>
  );
};

export default VetementCard;
