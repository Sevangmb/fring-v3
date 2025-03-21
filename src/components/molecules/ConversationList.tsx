
import React from "react";
import { Message } from "@/services/messagesService";
import { useAuth } from "@/contexts/AuthContext";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ConversationListProps {
  conversations: Message[];
  loading: boolean;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  loading
}) => {
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center p-4 border rounded-md">
            <div className="h-10 w-10 bg-muted rounded-full"></div>
            <div className="ml-4 space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-muted-foreground">Aucune conversation</p>
        <p className="text-sm">Commencez à discuter avec vos amis!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const otherUserId = conversation.sender_id === user?.id 
          ? conversation.receiver_id 
          : conversation.sender_id;
        
        const isUnread = !conversation.read && conversation.receiver_id === user?.id;
        
        // Extraire le nom d'utilisateur de l'email (si disponible)
        const email = conversation.sender_email || 'Utilisateur inconnu';
        const initials = email.substring(0, 2).toUpperCase();
        
        return (
          <Link
            key={conversation.id}
            to={`/messages/${otherUserId}`}
            className={cn(
              "flex items-center gap-3 p-3 border rounded-md hover:bg-accent/50 transition-colors",
              isUnread && "bg-primary/5 border-primary/20"
            )}
          >
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarFallback className={isUnread ? "bg-primary/10 text-primary" : ""}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className={cn("font-medium truncate", isUnread && "text-primary font-semibold")}>
                  {email}
                </p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(conversation.created_at), { 
                    addSuffix: true,
                    locale: fr 
                  })}
                </span>
              </div>
              <p className={cn(
                "text-sm text-muted-foreground truncate",
                isUnread && "text-foreground font-medium"
              )}>
                {conversation.sender_id === user?.id && "Vous: "}{conversation.content}
              </p>
            </div>
            {isUnread && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default ConversationList;
