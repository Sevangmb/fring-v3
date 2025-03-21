
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amis/types";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DemandesEnvoyeesCardProps {
  demande: Ami;
  onAnnuler: (id: number) => Promise<void>;
}

const DemandesEnvoyeesCard: React.FC<DemandesEnvoyeesCardProps> = ({ 
  demande, 
  onAnnuler 
}) => {
  const formattedDate = format(new Date(demande.created_at), 'dd MMMM yyyy', { locale: fr });
  
  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock size={20} />
          </div>
          <div>
            <CardTitle>Demande en attente</CardTitle>
            <Text className="text-sm text-muted-foreground">{demande.email || 'Email inconnu'}</Text>
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <Text className="text-sm">
            <span className="font-medium">Envoyée le</span>: {formattedDate}
          </Text>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onAnnuler(demande.id)}
        >
          <X className="mr-1 h-4 w-4" />
          Annuler
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemandesEnvoyeesCard;
