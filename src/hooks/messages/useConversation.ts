
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationMessages, markAsRead, sendNewMessage } from './messageOperations';

export const useConversation = (friendId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Charger les messages d'une conversation spécifique
  const loadConversation = useCallback(async (silent = false) => {
    if (!user || !friendId) {
      setMessages([]);
      setLoading(false);
      return;
    }
    
    try {
      if (!silent) setLoading(true);
      console.log(`Chargement des messages pour la conversation avec ${friendId}`);
      const enrichedMessages = await loadConversationMessages(user.id, friendId);
      
      // Ne mettre à jour les messages que s'ils sont différents pour éviter le re-rendu
      if (JSON.stringify(enrichedMessages) !== JSON.stringify(messages)) {
        setMessages(enrichedMessages);
      }
      
      // Marquer les messages comme lus
      await markAsRead(friendId);
    } catch (error: any) {
      console.error('Erreur lors du chargement des messages:', error);
      if (!silent) {
        toast({
          title: 'Erreur',
          description: error.message || 'Impossible de charger les messages',
          variant: 'destructive',
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user, friendId, toast, messages]);

  // Envoyer un message
  const handleSendMessage = async (content: string) => {
    if (!user || !friendId || !content.trim()) {
      console.error("Impossible d'envoyer le message: utilisateur, destinataire ou contenu manquant");
      return;
    }
    
    try {
      setSending(true);
      console.log(`Tentative d'envoi d'un message à ${friendId}: ${content}`);
      const enrichedMessage = await sendNewMessage(user.id, friendId, content.trim());
      
      if (enrichedMessage) {
        console.log("Message envoyé avec succès:", enrichedMessage);
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
    
    // Nettoyer l'intervalle précédent
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    // Configurer l'intervalle de rafraîchissement silencieux
    if (friendId) {
      console.log(`Configuration de l'intervalle de rafraîchissement pour la conversation avec ${friendId}`);
      refreshTimerRef.current = setInterval(() => loadConversation(true), 5000);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [friendId, loadConversation]);

  return {
    messages,
    loading,
    sending,
    sendMessage: handleSendMessage,
    refreshConversation: loadConversation
  };
};
