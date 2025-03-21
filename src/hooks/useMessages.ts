
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Message, 
  fetchConversation, 
  sendMessage, 
  markMessagesAsRead, 
  fetchConversationPreviews, 
  countUnreadMessages 
} from '@/services/messagesService';
import { getUserEmailById } from '@/services/amis/userEmail';

export const useMessages = (friendId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Charger les messages d'une conversation spécifique
  const loadConversation = useCallback(async () => {
    if (!user || !friendId) return;
    
    try {
      setLoading(true);
      const conversationMessages = await fetchConversation(friendId);
      
      // Enrichir les messages avec l'email de l'expéditeur
      const enrichedMessages = await Promise.all(
        conversationMessages.map(async (message) => {
          const senderId = message.sender_id;
          try {
            const email = await getUserEmailById(senderId);
            return { ...message, sender_email: email };
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'email pour ${senderId}:`, error);
            return { ...message, sender_email: 'Utilisateur inconnu' };
          }
        })
      );
      
      setMessages(enrichedMessages);
      
      // Marquer les messages comme lus
      if (friendId) {
        try {
          await markMessagesAsRead(friendId);
        } catch (error) {
          console.error('Erreur lors du marquage des messages comme lus:', error);
        }
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des messages:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les messages',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, friendId, toast]);

  // Charger les aperçus de conversation
  const loadConversationPreviews = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const previews = await fetchConversationPreviews();
      
      // Enrichir les aperçus avec les emails
      const enrichedPreviews = await Promise.all(
        previews.map(async (preview) => {
          const otherUserId = preview.sender_id === user.id ? preview.receiver_id : preview.sender_id;
          try {
            const email = await getUserEmailById(otherUserId);
            return { ...preview, sender_email: email };
          } catch (error) {
            console.error(`Erreur lors de la récupération de l'email pour ${otherUserId}:`, error);
            return { ...preview, sender_email: 'Utilisateur inconnu' };
          }
        })
      );
      
      setConversations(enrichedPreviews);
    } catch (error: any) {
      console.error('Erreur lors du chargement des aperçus de conversation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les conversations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Compter les messages non lus
  const loadUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const count = await countUnreadMessages();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
    }
  }, [user]);

  // Charger les données appropriées en fonction de friendId
  useEffect(() => {
    if (friendId) {
      loadConversation();
    } else {
      loadConversationPreviews();
    }
    loadUnreadCount();
  }, [friendId, loadConversation, loadConversationPreviews, loadUnreadCount]);

  // Envoyer un message
  const handleSendMessage = async (content: string) => {
    if (!user || !friendId || !content.trim()) return;
    
    try {
      setSending(true);
      const newMessage = await sendMessage(friendId, content.trim());
      
      // Ajouter le nouvel email à la liste des messages
      const email = await getUserEmailById(newMessage.sender_id);
      const enrichedMessage = { ...newMessage, sender_email: email };
      
      setMessages(prev => [...prev, enrichedMessage]);
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'envoyer le message',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    conversations,
    loading,
    sending,
    unreadCount,
    sendMessage: handleSendMessage,
    refreshConversation: loadConversation,
    refreshConversations: loadConversationPreviews,
    refreshUnreadCount: loadUnreadCount
  };
};
