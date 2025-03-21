
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationMessages, markAsRead, sendNewMessage } from './messageOperations';

export const useConversation = (friendId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Charger les messages d'une conversation spécifique
  const loadConversation = useCallback(async () => {
    if (!user || !friendId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const enrichedMessages = await loadConversationMessages(user.id, friendId);
      setMessages(enrichedMessages);
      
      // Marquer les messages comme lus
      await markAsRead(friendId);
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

  // Envoyer un message
  const handleSendMessage = async (content: string) => {
    if (!user || !friendId || !content.trim()) return;
    
    try {
      setSending(true);
      const enrichedMessage = await sendNewMessage(user.id, friendId, content.trim());
      
      if (enrichedMessage) {
        setMessages(prev => [...prev, enrichedMessage]);
      }
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

  // Charger au démarrage et lors du changement de friendId
  useEffect(() => {
    loadConversation();
    
    // Configurer l'intervalle de rafraîchissement
    if (friendId) {
      const interval = setInterval(loadConversation, 5000);
      return () => clearInterval(interval);
    }
  }, [friendId, loadConversation]);

  return {
    messages,
    loading,
    sending,
    sendMessage: handleSendMessage,
    refreshConversation: loadConversation
  };
};
