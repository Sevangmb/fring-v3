
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { resolveUserIdentifier, isEmail } from "@/services/amis/userEmail";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import MessagesSidebar from "@/components/organisms/MessagesSidebar";
import MessagesContent from "@/components/organisms/MessagesContent";
import { useToast } from "@/hooks/use-toast";

interface MessagesPageContentProps {
  friendIdOrEmail?: string;
}

const MessagesPageContent: React.FC<MessagesPageContentProps> = ({ friendIdOrEmail }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [friendId, setFriendId] = useState<string | null>(null);
  const [friendEmail, setFriendEmail] = useState<string | null>(null);
  const [resolving, setResolving] = useState<boolean>(!!friendIdOrEmail);
  const resolvingRef = useRef(false);
  
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
      if (!friendIdOrEmail || !user || resolvingRef.current) {
        if (!friendIdOrEmail) {
          setFriendId(null);
          setFriendEmail(null);
          setResolving(false);
        }
        return;
      }
      
      try {
        resolvingRef.current = true;
        setResolving(true);
        console.log(`Résolution de l'identifiant: ${friendIdOrEmail}`);
        
        const { id, email } = await resolveUserIdentifier(friendIdOrEmail);
        
        if (id) {
          setFriendId(id);
          setFriendEmail(email);
          console.log(`Identifiant résolu: ID=${id}, Email=${email}`);
          
          // Si l'URL contient un UUID et que nous avons un email, rediriger vers l'URL avec l'email
          if (friendIdOrEmail.includes('-') && email && isEmail(email) && friendIdOrEmail !== email) {
            navigate(`/messages/${email}`, { replace: true });
          }
        } else {
          console.error("Impossible de trouver l'utilisateur avec cet identifiant", friendIdOrEmail);
          toast({
            title: "Utilisateur introuvable",
            description: `Impossible de trouver l'utilisateur avec l'identifiant ${friendIdOrEmail}`,
            variant: "destructive"
          });
          navigate("/messages", { replace: true });
        }
      } catch (error) {
        console.error("Erreur lors de la résolution de l'identifiant:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la recherche de l'utilisateur",
          variant: "destructive"
        });
      } finally {
        setResolving(false);
        resolvingRef.current = false;
      }
    };
    
    resolveIdentifier();
  }, [friendIdOrEmail, navigate, toast, user]);

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
        refreshConversations={refreshConversations}
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
