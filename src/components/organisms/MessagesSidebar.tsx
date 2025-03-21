
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import ConversationList from "@/components/molecules/ConversationList";
import { Button } from "@/components/ui/button";
import { Plus, Users, RefreshCw } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";

interface MessagesSidebarProps {
  conversations: Message[];
  loading: boolean;
  friendEmail?: string | null;
  isMobile: boolean;
  user: User;
  refreshConversations: () => Promise<void>;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({
  conversations,
  loading,
  friendEmail,
  isMobile,
  user,
  refreshConversations
}) => {
  const navigate = useNavigate();
  const { chargerAmis, filteredAmis, loadingAmis } = useAmis();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const amisLoadedRef = useRef(false);

  // Charger la liste des amis au démarrage et quand le dialogue est ouvert
  useEffect(() => {
    if (user && (isDialogOpen || !amisLoadedRef.current)) {
      console.log("Chargement des amis pour la liste de conversations");
      chargerAmis();
      amisLoadedRef.current = true;
    }
  }, [user, chargerAmis, isDialogOpen]);

  // Démarrer une nouvelle conversation avec un ami
  const startNewConversation = (amiEmail: string) => {
    setIsDialogOpen(false);
    navigate(`/messages/${amiEmail}`);
  };

  // Rafraîchir manuellement les conversations
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("Rafraîchissement manuel des conversations");
      await refreshConversations();
      toast({
        title: "Mise à jour terminée",
        description: "La liste des conversations a été mise à jour",
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div 
      className={cn(
        "w-full md:w-1/3 md:border-r h-full",
        friendEmail && isMobile ? "hidden" : "flex flex-col"
      )}
    >
      <div className="p-3 flex items-center justify-between border-b">
        <h2 className="font-semibold text-lg">Messages</h2>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Rafraîchir les conversations"
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="sr-only">Rafraîchir</span>
          </Button>
          
          <NewConversationDialog 
            isOpen={isDialogOpen}
            setIsOpen={setIsDialogOpen}
            filteredAmis={filteredAmis.amisAcceptes}
            loadingAmis={loadingAmis}
            startNewConversation={startNewConversation}
            user={user}
            navigate={navigate}
          />
        </div>
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
  loadingAmis: boolean;
  startNewConversation: (amiEmail: string) => void;
  user: User;
  navigate: (path: string) => void;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  isOpen,
  setIsOpen,
  filteredAmis,
  loadingAmis,
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
          {loadingAmis ? (
            <div className="flex justify-center items-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Chargement des amis...</span>
            </div>
          ) : filteredAmis.length > 0 ? (
            <div className="space-y-2">
              {filteredAmis.map((ami) => (
                <Button
                  key={ami.id}
                  variant="ghost"
                  className="w-full justify-start p-2 h-auto"
                  onClick={() => startNewConversation(ami.email || "")}
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
