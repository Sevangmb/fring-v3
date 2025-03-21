
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ConversationList from "@/components/molecules/ConversationList";
import { useAmis } from "@/hooks/useAmis";
import { Message } from "@/services/messagesService";
import { User } from "@supabase/supabase-js";
import { toast } from "@/hooks/use-toast";
import MessagesSidebarHeader from "@/components/molecules/MessagesSidebarHeader";

interface MessagesSidebarProps {
  conversations: Message[];
  loading: boolean;
  friendEmail?: string | null;
  isMobile: boolean;
  user: User;
  refreshConversations: () => Promise<void>;
}

const MessagesSidebar: React.FC<MessagesSidebarProps> = ({
  conversations,
  loading,
  friendEmail,
  isMobile,
  user,
  refreshConversations
}) => {
  const { chargerAmis, filteredAmis, loadingAmis } = useAmis();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const amisLoadedRef = useRef(false);

  // Charger la liste des amis au démarrage et quand le dialogue est ouvert
  useEffect(() => {
    if (user && (isDialogOpen || !amisLoadedRef.current)) {
      console.log("Chargement des amis pour la liste de conversations");
      chargerAmis();
      amisLoadedRef.current = true;
    }
  }, [user, chargerAmis, isDialogOpen]);

  // Rafraîchir manuellement les conversations
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      console.log("Rafraîchissement manuel des conversations");
      await refreshConversations();
      toast({
        title: "Mise à jour terminée",
        description: "La liste des conversations a été mise à jour",
      });
    } catch (error) {
      console.error("Erreur lors du rafraîchissement:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div 
      className={cn(
        "w-full md:w-1/3 md:border-r h-full",
        friendEmail && isMobile ? "hidden" : "flex flex-col"
      )}
    >
      <MessagesSidebarHeader
        isRefreshing={isRefreshing}
        handleRefresh={handleRefresh}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        filteredAmis={filteredAmis.amisAcceptes}
        loadingAmis={loadingAmis}
        user={user}
      />
      <div className="p-3 overflow-y-auto flex-1">
        <ConversationList 
          conversations={conversations} 
          loading={loading} 
        />
      </div>
    </div>
  );
};

export default MessagesSidebar;
