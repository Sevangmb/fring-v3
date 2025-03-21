
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import { getUserIdByEmail, getUserEmailById } from "@/services/amis/userEmail";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import MessagesSidebar from "@/components/organisms/MessagesSidebar";
import MessagesContent from "@/components/organisms/MessagesContent";

interface MessagesPageContentProps {
  friendIdOrEmail?: string;
}

const MessagesPageContent: React.FC<MessagesPageContentProps> = ({ friendIdOrEmail }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [friendId, setFriendId] = useState<string | null>(null);
  const [friendEmail, setFriendEmail] = useState<string | null>(null);
  const [resolving, setResolving] = useState<boolean>(!!friendIdOrEmail);
  
  const {
    messages,
    conversations,
    loading,
    sending,
    sendMessage,
    refreshConversations
  } = useMessages(friendId);

  // Résoudre l'ID ou l'email de l'ami
  useEffect(() => {
    const resolveIdentifier = async () => {
      if (!friendIdOrEmail) {
        setFriendId(null);
        setFriendEmail(null);
        setResolving(false);
        return;
      }
      
      try {
        setResolving(true);
        // Vérifier si c'est un UUID (format ID) ou un email
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(friendIdOrEmail);
        
        if (isUuid) {
          const email = await getUserEmailById(friendIdOrEmail);
          setFriendId(friendIdOrEmail);
          setFriendEmail(email);
        } else {
          // C'est un email, trouver l'ID correspondant
          const id = await getUserIdByEmail(friendIdOrEmail);
          if (id) {
            setFriendId(id);
            setFriendEmail(friendIdOrEmail);
          } else {
            console.error("Impossible de trouver l'utilisateur avec cet email", friendIdOrEmail);
            navigate("/messages", { replace: true });
          }
        }
      } catch (error) {
        console.error("Erreur lors de la résolution de l'identifiant:", error);
      } finally {
        setResolving(false);
      }
    };
    
    resolveIdentifier();
  }, [friendIdOrEmail, navigate]);

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
      <MessagesSidebar 
        conversations={conversations}
        loading={loading || resolving}
        friendEmail={friendEmail}
        isMobile={isMobile}
        user={user}
      />
      
      {/* Conversation active (masquée sur mobile si aucune conversation n'est sélectionnée) */}
      <MessagesContent
        friendId={friendId}
        friendEmail={friendEmail}
        messages={messages}
        loading={loading || resolving}
        sending={sending}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MessagesPageContent;
