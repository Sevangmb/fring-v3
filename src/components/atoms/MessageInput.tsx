
import React, { useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  isSending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isSending
}) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;
    
    try {
      console.log("Envoi du message:", message);
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex items-center gap-2 bg-card p-2 border-t sticky bottom-0"
    >
      <Input
        placeholder="Écrivez votre message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={isSending}
        className="flex-1"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={isSending || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default MessageInput;
