
import { useConversation } from './messages/useConversation';
import { useConversationList } from './messages/useConversationList';
import { useUnreadCount } from './messages/useUnreadCount';

export const useMessages = (friendId?: string) => {
  // Utiliser les hooks spécialisés
  const { 
    messages, 
    loading: messagesLoading, 
    sending,
    sendMessage, 
    refreshConversation 
  } = useConversation(friendId);
  
  const { 
    conversations, 
    loading: conversationsLoading,
    refreshConversations 
  } = useConversationList();
  
  const { 
    unreadCount,
    refreshUnreadCount 
  } = useUnreadCount();

  // Combiner les résultats
  return {
    // Données de la conversation active
    messages,
    sending,
    sendMessage,
    refreshConversation,
    
    // Liste des conversations
    conversations,
    refreshConversations,
    
    // Compteur de messages non lus
    unreadCount,
    refreshUnreadCount,
    
    // État de chargement global
    loading: friendId ? messagesLoading : conversationsLoading
  };
};
