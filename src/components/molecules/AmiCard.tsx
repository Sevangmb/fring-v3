
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { UserCheck, UserX } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amis/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface AmiCardProps {
  ami: Ami;
  onRetirer: (id: number) => Promise<void>;
}

const AmiCard: React.FC<AmiCardProps> = ({ ami, onRetirer }) => {
  // Extraire les initiales de l'email pour l'avatar
  const getInitials = (email: string) => {
    if (!email) return "?";
    return email.slice(0, 2).toUpperCase();
  };

  const timeAgo = formatDistanceToNow(new Date(ami.created_at), { 
    addSuffix: true,
    locale: fr 
  });
  
  const formattedDate = format(new Date(ami.created_at), 'dd MMMM yyyy', { locale: fr });

  return (
    <Card hoverable>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-green-100">
            <AvatarFallback className="text-green-600">{getInitials(ami.email || '')}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>Ami</CardTitle>
            <Text className="text-muted-foreground">
              {ami.email || 'Email inconnu'}
            </Text>
          </div>
        </div>
        <div className="mt-4 p-3 bg-muted/30 rounded-md">
          <Text className="text-sm">
            <span className="font-medium">Ami depuis</span>: {timeAgo}
            <br />
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </Text>
        </div>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={() => onRetirer(ami.id)}
        >
          <UserX className="mr-1 h-4 w-4" />
          Retirer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AmiCard;
