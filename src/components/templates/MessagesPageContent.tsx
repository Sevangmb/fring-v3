
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import ConversationList from "@/components/molecules/ConversationList";
import MessagesList from "@/components/molecules/MessagesList";
import MessageInput from "@/components/atoms/MessageInput";
import ConversationHeader from "@/components/organisms/ConversationHeader";
import { getUserEmailById } from "@/services/amis/userEmail";
import { Button } from "@/components/ui/button";
import { Mail, Plus, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

const MessagesPageContent: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [friendEmail, setFriendEmail] = useState<string | null>(null);
  const {
    messages,
    conversations,
    loading,
    sending,
    sendMessage,
    refreshConversations
  } = useMessages(friendId);

  // Récupérer la liste des amis pour le sélecteur
  const { chargerAmis, filteredAmis } = useAmis();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Charger la liste des amis au démarrage
  useEffect(() => {
    if (user) {
      chargerAmis();
    }
  }, [user, chargerAmis]);

  // Récupérer l'email de l'ami sélectionné
  useEffect(() => {
    if (friendId) {
      const fetchFriendEmail = async () => {
        try {
          const email = await getUserEmailById(friendId);
          setFriendEmail(email);
        } catch (error) {
          console.error("Erreur lors de la récupération de l'email:", error);
          setFriendEmail("Utilisateur inconnu");
        }
      };
      
      fetchFriendEmail();
    } else {
      // Réinitialiser l'email si aucun ami n'est sélectionné
      setFriendEmail(null);
    }
  }, [friendId]);

  // Démarrer une nouvelle conversation avec un ami
  const startNewConversation = (amiId: string) => {
    setIsDialogOpen(false);
    navigate(`/messages/${amiId}`);
  };

  // Vérifier si la page est affichée sur mobile
  const isMobile = window.innerWidth < 768;
  
  if (!user) {
    return (
      <div className="text-center py-12 mt-8">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
          <Mail className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">Connectez-vous</h3>
        <p className="text-muted-foreground mt-2">
          Vous devez être connecté pour accéder à vos messages.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex border rounded-md bg-card overflow-hidden">
      {/* Liste des conversations (masquée sur mobile si une conversation est sélectionnée) */}
      <div 
        className={cn(
          "w-full md:w-1/3 md:border-r",
          friendId && isMobile ? "hidden" : "flex flex-col"
        )}
      >
        <div className="p-3 flex items-center justify-between border-b">
          <h2 className="font-semibold text-lg">Messages</h2>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                {filteredAmis.amisAcceptes.length > 0 ? (
                  <div className="space-y-2">
                    {filteredAmis.amisAcceptes.map((ami) => (
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
                        setIsDialogOpen(false);
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
        </div>
        <div className="p-3 overflow-y-auto flex-1">
          <ConversationList 
            conversations={conversations} 
            loading={loading} 
          />
        </div>
      </div>
      
      {/* Conversation active (masquée sur mobile si aucune conversation n'est sélectionnée) */}
      <div 
        className={cn(
          "w-full md:w-2/3 flex flex-col",
          !friendId && isMobile ? "hidden" : "flex flex-col h-full"
        )}
      >
        {friendId ? (
          <>
            <ConversationHeader 
              friendEmail={friendEmail} 
              friendId={friendId} 
            />
            <MessagesList 
              messages={messages} 
              loading={loading} 
            />
            <MessageInput 
              onSendMessage={sendMessage} 
              isSending={sending} 
            />
          </>
        ) : (
          <div className="flex flex-col h-full justify-center items-center p-8 text-center">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <Mail className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Sélectionnez une conversation</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Choisissez une conversation dans la liste ou commencez-en une nouvelle.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPageContent;
