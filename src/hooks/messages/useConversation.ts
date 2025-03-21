
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationMessages } from './conversationLoader';
import { markAsRead } from './messageActions';
import { sendNewMessage } from './messageActions';

export const useConversation = (friendId?: string | null) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const lastLoadedRef = useRef<string | null>(null);
  const loadingRef = useRef(false);
  const messagesJsonRef = useRef<string>('');

  // Charger les messages d'une conversation spécifique
  const loadConversation = useCallback(async (silent = false) => {
    if (!user || !friendId) {
      setMessages([]);
      if (loading) setLoading(false);
      return;
    }
    
    // Éviter les rafraîchissements inutiles pour le même ID et éviter les chargements simultanés
    if ((lastLoadedRef.current === friendId && messages.length > 0 && !silent) || loadingRef.current) {
      return;
    }
    
    try {
      loadingRef.current = true;
      if (!silent) setLoading(true);
      console.log(`Chargement des messages pour la conversation avec ${friendId}`);
      const enrichedMessages = await loadConversationMessages(user.id, friendId);
      lastLoadedRef.current = friendId;
      
      // Ne mettre à jour les messages que s'ils sont différents pour éviter le re-rendu
      const newMessagesJson = JSON.stringify(enrichedMessages);
      
      if (newMessagesJson !== messagesJsonRef.current) {
        messagesJsonRef.current = newMessagesJson;
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
      loadingRef.current = false;
      if (!silent) setLoading(false);
    }
  }, [user, friendId, toast, loading]);

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
        
        // Mettre à jour le cache de messages JSON
        messagesJsonRef.current = JSON.stringify([...messages, enrichedMessage]);
        
        // Rafraîchir la conversation après l'envoi d'un message
        setTimeout(() => loadConversation(true), 300);
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

  // Charger uniquement quand friendId change
  useEffect(() => {
    if (friendId && user) {
      loadConversation();
    } else {
      setMessages([]);
      setLoading(false);
    }
  }, [friendId, user]);  // Retirer loadConversation de la liste des dépendances

  return {
    messages,
    loading,
    sending,
    sendMessage: handleSendMessage,
    refreshConversation: loadConversation
  };
};
