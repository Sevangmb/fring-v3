
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";
import { getUserEmailById } from "@/services/amis/userEmail";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import MessagesSidebar from "@/components/organisms/MessagesSidebar";
import MessagesContent from "@/components/organisms/MessagesContent";

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
        loading={loading}
        friendId={friendId}
        isMobile={isMobile}
        user={user}
      />
      
      {/* Conversation active (masquée sur mobile si aucune conversation n'est sélectionnée) */}
      <MessagesContent
        friendId={friendId}
        friendEmail={friendEmail}
        messages={messages}
        loading={loading}
        sending={sending}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
};

export default MessagesPageContent;
