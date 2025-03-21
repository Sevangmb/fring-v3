
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import NewConversationDialog from "./NewConversationDialog";
import { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

interface MessagesSidebarHeaderProps {
  isRefreshing: boolean;
  handleRefresh: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  filteredAmis: any[];
  loadingAmis: boolean;
  user: User;
}

const MessagesSidebarHeader: React.FC<MessagesSidebarHeaderProps> = ({
  isRefreshing,
  handleRefresh,
  isDialogOpen,
  setIsDialogOpen,
  filteredAmis,
  loadingAmis,
  user
}) => {
  const navigate = useNavigate();

  // Démarrer une nouvelle conversation avec un ami
  const startNewConversation = (amiEmail: string) => {
    setIsDialogOpen(false);
    navigate(`/messages/${amiEmail}`);
  };

  return (
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
          filteredAmis={filteredAmis}
          loadingAmis={loadingAmis}
          startNewConversation={startNewConversation}
          user={user}
          navigate={navigate}
        />
      </div>
    </div>
  );
};

export default MessagesSidebarHeader;
