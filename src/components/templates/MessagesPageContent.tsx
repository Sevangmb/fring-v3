
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
import { Mail, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const MessagesPageContent: React.FC = () => {
  const { friendId } = useParams<{ friendId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [friendEmail, setFriendEmail] = useState<string>("");
  const {
    messages,
    conversations,
    loading,
    sending,
    sendMessage
  } = useMessages(friendId);

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
    }
  }, [friendId]);

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
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Nouveau
          </Button>
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
