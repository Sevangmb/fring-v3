
import React, { useEffect, useRef } from "react";
import { Message } from "@/services/messagesService";
import MessageBubble from "@/components/atoms/MessageBubble";

interface MessagesListProps {
  messages: Message[];
  loading: boolean;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  loading
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-4">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        <p className="text-sm text-muted-foreground mt-2">Chargement des messages...</p>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full justify-center items-center p-4">
        <p className="text-muted-foreground">Aucun message</p>
        <p className="text-sm">Commencez à discuter!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesList;
