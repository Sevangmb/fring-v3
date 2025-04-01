
import React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/services/messagesService";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = user?.id === message.sender_id;
  
  // Obtenir le nom d'affichage à partir de l'email
  const getSenderDisplayName = () => {
    if (isCurrentUser) {
      return "Vous";
    }
    
    if (message.sender_email) {
      // Si c'est un email, prendre la partie avant @
      if (message.sender_email.includes('@')) {
        return message.sender_email.split('@')[0];
      }
      return message.sender_email;
    }
    
    return "Utilisateur";
  };
  
  // Nom d'affichage convivial
  const displayName = getSenderDisplayName();
  
  return (
    <div 
      className={cn(
        "flex mb-4", 
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div 
        className={cn(
          "max-w-[75%] rounded-lg px-4 py-2 break-words",
          isCurrentUser 
            ? "bg-primary text-primary-foreground rounded-br-none" 
            : "bg-muted rounded-bl-none"
        )}
      >
        {!isCurrentUser && (
          <p className="text-xs font-medium mb-1 text-muted-foreground">
            {displayName}
          </p>
        )}
        <p className="text-sm">
          {message.content}
        </p>
        <p className={cn(
          "text-xs mt-1",
          isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;
