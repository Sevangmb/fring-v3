
import React from "react";
import { cn } from "@/lib/utils";
import ConversationHeader from "@/components/organisms/ConversationHeader";
import MessagesList from "@/components/molecules/MessagesList";
import MessageInput from "@/components/atoms/MessageInput";
import { Mail } from "lucide-react";
import { Message } from "@/services/messagesService";

interface MessagesContentProps {
  friendId?: string;
  friendEmail: string | null;
  messages: Message[];
  loading: boolean;
  sending: boolean;
  sendMessage: (content: string) => Promise<void>;
  isMobile: boolean;
}

const MessagesContent: React.FC<MessagesContentProps> = ({
  friendId,
  friendEmail,
  messages,
  loading,
  sending,
  sendMessage,
  isMobile
}) => {
  return (
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
        <EmptyConversationState />
      )}
    </div>
  );
};

// Composant d'état vide pour quand aucune conversation n'est sélectionnée
const EmptyConversationState: React.FC = () => {
  return (
    <div className="flex flex-col h-full justify-center items-center p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Mail className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">Sélectionnez une conversation</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Choisissez une conversation dans la liste ou commencez-en une nouvelle.
      </p>
    </div>
  );
};

export default MessagesContent;
