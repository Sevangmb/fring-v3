
import React from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, X, UserX } from "lucide-react";
import { Ami } from "@/services/amis/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AmiListItemProps {
  ami: Ami;
  onRetirer: (id: number) => Promise<void>;
}

const AmiListItem: React.FC<AmiListItemProps> = ({ ami, onRetirer }) => {
  // Extraire les initiales de l'email pour l'avatar
  const getInitials = (email: string) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(ami.created_at), { 
    addSuffix: true,
    locale: fr 
  });

  return (
    <div className="flex items-center justify-between p-4 hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 bg-green-100">
          <AvatarFallback className="text-green-600">{getInitials(ami.email || '')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{ami.email || 'Email inconnu'}</p>
          <p className="text-xs text-muted-foreground">Ami depuis {timeAgo}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onRetirer(ami.id)}
        >
          <UserX className="h-4 w-4 mr-1" />
          Retirer
        </Button>
      </div>
    </div>
  );
};

export default AmiListItem;
