
import React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

interface ConversationHeaderProps {
  friendEmail: string | null;
  friendId: string;
}

const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  friendEmail,
  friendId
}) => {
  // Obtenir un nom d'affichage convivial
  const getDisplayName = () => {
    if (!friendEmail) return "Chargement...";
    
    // Si c'est un email, prendre la partie avant @
    if (friendEmail.includes('@')) {
      return friendEmail.split('@')[0];
    }
    
    return friendEmail;
  };
  
  // Extraire les initiales pour l'avatar
  const getInitials = () => {
    const displayName = getDisplayName();
    if (displayName === "Chargement...") return "...";
    return displayName.substring(0, 2).toUpperCase();
  };
  
  // Définir un nom d'affichage basé sur l'email ou un texte par défaut
  const displayName = getDisplayName();
  const initials = getInitials();

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
          <p className="font-medium">{displayName}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ConversationHeader;
