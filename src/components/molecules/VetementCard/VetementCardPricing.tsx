
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/atoms/Typography";
import { Vetement } from '@/services/vetement/types';

interface VetementCardPricingProps {
  vetement: Vetement;
  prixFinal: number | null;
  marge: number | null;
}

const VetementCardPricing: React.FC<VetementCardPricingProps> = ({ 
  vetement, 
  prixFinal, 
  marge 
}) => {
  return (
    <div className="mt-3 space-y-1 px-6">
      <div className="flex items-center justify-between">
        <Text variant="subtle">Prix:</Text>
        <div className="flex items-center gap-2">
          {vetement.promo_pourcentage ? (
            <>
              <Text className="line-through text-muted-foreground">
                {vetement.prix_vente} €
              </Text>
              <Text className="font-semibold text-primary">
                {prixFinal?.toFixed(2)} €
              </Text>
              <Badge variant="outline" className="ml-1">
                -{vetement.promo_pourcentage}%
              </Badge>
            </>
          ) : (
            <Text className="font-semibold">{vetement.prix_vente} €</Text>
          )}
        </div>
      </div>

      {marge !== null && (
        <div className="flex items-center justify-between text-xs">
          <Text variant="subtle">Marge:</Text>
          <Text className={marge > 0 ? "text-green-600" : "text-red-600"}>
            {marge.toFixed(2)} €
          </Text>
        </div>
      )}

      {vetement.etat && (
        <div className="flex items-center justify-between text-xs">
          <Text variant="subtle">État:</Text>
          <Badge variant="outline" className="capitalize">
            {vetement.etat}
          </Badge>
        </div>
      )}

      {vetement.disponibilite && vetement.disponibilite !== "disponible" && (
        <Badge 
          className={`w-full justify-center mt-1 ${
            vetement.disponibilite === "vendu" ? "bg-green-600" : "bg-amber-500"
          }`}
        >
          {vetement.disponibilite === "vendu" ? "Vendu" : "Réservé"}
        </Badge>
      )}
    </div>
  );
};

export default VetementCardPricing;
