
import React from "react";
import { Button } from "@/components/ui/button";
import { Clock, X } from "lucide-react";
import { Ami } from "@/services/amis/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DemandesEnvoyeesListItemProps {
  demande: Ami;
  onAnnuler: (id: number) => Promise<void>;
}

const DemandesEnvoyeesListItem: React.FC<DemandesEnvoyeesListItemProps> = ({ 
  demande, 
  onAnnuler 
}) => {
  // Extraire les initiales de l'email pour l'avatar si disponible
  const getInitials = (email: string) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(demande.created_at), { 
    addSuffix: true,
    locale: fr 
  });

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-amber-100">
          <AvatarFallback className="text-amber-600"><Clock size={18} /></AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{demande.email || 'Email inconnu'}</p>
          <p className="text-xs text-muted-foreground">
            Demande envoyée {timeAgo}
          </p>
        </div>
      </div>
      <div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onAnnuler(demande.id)}
        >
          <X className="mr-1 h-4 w-4" />
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default DemandesEnvoyeesListItem;
