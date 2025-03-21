
import React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ConversationHeaderProps {
  friendEmail: string;
  friendId: string;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  friendEmail,
  friendId
}) => {
  // Extraire les initiales de l'email pour l'avatar
  const initials = friendEmail.substring(0, 2).toUpperCase();

  return (
    <div className="bg-card border-b p-2 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="md:hidden"
        >
          <Link to="/messages">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{friendEmail}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
