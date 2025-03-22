
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ami } from "@/services/amis";
import FavoriButton from '@/components/atoms/FavoriButton';

interface AmiListItemProps {
  ami: Ami;
  onRetirer: (id: number) => Promise<void>;
  onMessage?: (friendId: string) => void;
}

const AmiListItem: React.FC<AmiListItemProps> = ({ 
  ami,
  onRetirer,
  onMessage
}) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    if (onMessage) {
      onMessage(ami.ami_id);
      navigate(`/messages/${ami.ami_id}`);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback>{ami.email.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium">{ami.email}</h3>
              <p className="text-xs text-muted-foreground">
                {ami.status === "pending" ? "En attente" : "Ami"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <FavoriButton 
              type="utilisateur" 
              elementId={ami.ami_id} 
              nom={ami.email}
            />
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={handleMessage} 
              className="py-1.5"
            >
              <MessageCircle size={16} className="mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onRetirer(ami.id)}
            >
              Retirer
            </Button>
          </div>
        </div>
        
        {ami.status === "pending" && (
          <p className="text-xs text-muted-foreground mt-2">
            En attente de confirmation.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AmiListItem;

