
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
    
    await onSendMessage(message);
    setMessage("");
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
