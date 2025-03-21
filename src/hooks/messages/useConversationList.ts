
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationPreviewsWithEmail } from './messageOperations';

export const useConversationList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastLoadedRef = useRef<string | null>(null);

  // Charger les aperçus de conversation
  const loadConversationPreviews = useCallback(async (silent = false) => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    // Éviter de charger plusieurs fois le même utilisateur
    if (lastLoadedRef.current === user.id && conversations.length > 0 && !silent) {
      return;
    }
    
    try {
      if (!silent) setLoading(true);
      const enrichedPreviews = await loadConversationPreviewsWithEmail(user.id);
      lastLoadedRef.current = user.id;
      
      // Ne mettre à jour les conversations que si elles sont différentes
      const newPreviewsJson = JSON.stringify(enrichedPreviews);
      const currentPreviewsJson = JSON.stringify(conversations);
      
      if (newPreviewsJson !== currentPreviewsJson) {
        setConversations(enrichedPreviews);
      }
    } catch (error: any) {
      console.error('Erreur lors du chargement des aperçus de conversation:', error);
      if (!silent) {
        toast({
          title: 'Erreur',
          description: error.message || 'Impossible de charger les conversations',
          variant: 'destructive',
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, [user, toast, conversations]);

  // Charger au démarrage et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    if (user) {
      loadConversationPreviews();
      
      // Nettoyer l'intervalle précédent
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // Rafraîchir les conversations toutes les 10 secondes (silencieusement)
      refreshTimerRef.current = setInterval(() => loadConversationPreviews(true), 10000);
    } else {
      setConversations([]);
      setLoading(false);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [user, loadConversationPreviews]);

  return {
    conversations,
    loading,
    refreshConversations: loadConversationPreviews
  };
};
