
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, X, User } from "lucide-react";
import { Ami } from "@/services/amis/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DemandesRecuesListItemProps {
  demande: Ami;
  onAccepter: (id: number) => Promise<void>;
  onRejeter: (id: number) => Promise<void>;
}

const DemandesRecuesListItem: React.FC<DemandesRecuesListItemProps> = ({ 
  demande, 
  onAccepter, 
  onRejeter 
}) => {
  // Extraire les initiales de l'email pour l'avatar
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
        <Avatar className="h-10 w-10 bg-primary/10">
          <AvatarFallback><User size={18} /></AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{demande.email || 'Email inconnu'}</p>
          <p className="text-xs text-muted-foreground">Demande reçue {timeAgo}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onRejeter(demande.id)}
        >
          <X className="h-4 w-4 mr-1" />
          Refuser
        </Button>
        <Button 
          size="sm"
          onClick={() => onAccepter(demande.id)}
        >
          <Check className="h-4 w-4 mr-1" />
          Accepter
        </Button>
      </div>
    </div>
  );
};

export default DemandesRecuesListItem;
