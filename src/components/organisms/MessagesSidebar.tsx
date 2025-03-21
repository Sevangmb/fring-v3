
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ConversationList from "@/components/molecules/ConversationList";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { useAmis } from "@/hooks/useAmis";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/services/messagesService";
import { User } from "@supabase/supabase-js";

interface MessagesSidebarProps {
  conversations: Message[];
  loading: boolean;
  friendId?: string;
  isMobile: boolean;
  user: User;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({
  conversations,
  loading,
  friendId,
  isMobile,
  user
}) => {
  const navigate = useNavigate();
  const { chargerAmis, filteredAmis } = useAmis();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Charger la liste des amis au démarrage
  useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  // Démarrer une nouvelle conversation avec un ami
  const startNewConversation = (amiId: string) => {
    setIsDialogOpen(false);
    navigate(`/messages/${amiId}`);
  };

  return (
    <div 
      className={cn(
        "w-full md:w-1/3 md:border-r",
        friendId && isMobile ? "hidden" : "flex flex-col"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b">
        <h2 className="font-semibold text-lg">Messages</h2>
        
        <NewConversationDialog 
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          filteredAmis={filteredAmis.amisAcceptes}
          startNewConversation={startNewConversation}
          user={user}
          navigate={navigate}
        />
      </div>
      <div className="p-3 overflow-y-auto flex-1">
        <ConversationList 
          conversations={conversations} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

// Composant de dialogue pour démarrer une nouvelle conversation
interface NewConversationDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  filteredAmis: any[];
  startNewConversation: (amiId: string) => void;
  user: User;
  navigate: (path: string) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  isOpen,
  setIsOpen,
  filteredAmis,
  startNewConversation,
  user,
  navigate
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Nouveau
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Démarrer une nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="mt-4 max-h-[60vh]">
          {filteredAmis.length > 0 ? (
            <div className="space-y-2">
              {filteredAmis.map((ami) => (
                <Button
                  key={ami.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => startNewConversation(ami.ami_id === user.id ? ami.user_id : ami.ami_id)}
                >
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>
                      {ami.email ? ami.email.substring(0, 2).toUpperCase() : 'UN'}
                    </AvatarFallback>
                  </Avatar>
                  <span>{ami.email || "Utilisateur inconnu"}</span>
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <Users className="h-10 w-10 mx-auto text-muted-foreground" />
              <p className="mt-2">Vous n'avez pas encore d'amis</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/mes-amis");
                }}
              >
                Ajouter des amis
              </Button>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesSidebar;
