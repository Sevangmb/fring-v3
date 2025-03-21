
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Button } from "@/components/ui/button";
import { UserCheck, X } from "lucide-react";
import Card, { CardHeader, CardTitle, CardFooter } from "@/components/molecules/Card";
import { Ami } from "@/services/amis/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
        <Text className="mt-2">
          Vous êtes amis depuis le {new Date(ami.created_at).toLocaleDateString()}.
        </Text>
      </CardHeader>
      <CardFooter className="flex justify-end">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => onRetirer(ami.id)}
        >
          <X className="mr-1 h-4 w-4" />
          Retirer
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AmiCard;
