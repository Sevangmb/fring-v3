
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { User, Check, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amis/types";

interface DemandesRecuesCardProps {
  demande: Ami;
  onAccepter: (id: number) => Promise<void>;
  onRejeter: (id: number) => Promise<void>;
}

const DemandesRecuesCard: React.FC<DemandesRecuesCardProps> = ({ 
  demande, 
  onAccepter, 
  onRejeter 
}) => {
  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User size={20} />
          </div>
          <CardTitle>Demande d'ami</CardTitle>
        </div>
        <Text className="mt-2">
          Vous avez reçu une demande d'ami de {demande.email || 'quelqu\'un'}.
        </Text>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button 
          size="sm" 
          variant="destructive"
          onClick={() => onRejeter(demande.id)}
        >
          <X className="mr-1 h-4 w-4" />
          Refuser
        </Button>
        <Button 
          size="sm"
          onClick={() => onAccepter(demande.id)}
        >
          <Check className="mr-1 h-4 w-4" />
          Accepter
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DemandesRecuesCard;
