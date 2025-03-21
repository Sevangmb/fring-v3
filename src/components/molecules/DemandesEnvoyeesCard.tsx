
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amiService";

interface DemandesEnvoyeesCardProps {
  demande: Ami;
  onAnnuler: (id: number) => Promise<void>;
}

const DemandesEnvoyeesCard: React.FC<DemandesEnvoyeesCardProps> = ({ 
  demande, 
  onAnnuler 
}) => {
  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
            <Clock size={20} />
          </div>
          <CardTitle>Demande en attente</CardTitle>
        </div>
        <Text className="mt-2">
          Votre demande d'ami est en attente d'acceptation.
        </Text>
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
