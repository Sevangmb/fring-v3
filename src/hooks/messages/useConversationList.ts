
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

  // Charger les aperçus de conversation
  const loadConversationPreviews = useCallback(async (silent = false) => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    try {
      if (!silent) setLoading(true);
      const enrichedPreviews = await loadConversationPreviewsWithEmail(user.id);
      
      // Ne mettre à jour les conversations que si elles sont différentes 
      if (JSON.stringify(enrichedPreviews) !== JSON.stringify(conversations)) {
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
    loadConversationPreviews();
    
    // Nettoyer l'intervalle précédent
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
    
    if (user) {
      // Rafraîchir les conversations toutes les 10 secondes (silencieusement)
      refreshTimerRef.current = setInterval(() => loadConversationPreviews(true), 10000);
    }
    
    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [loadConversationPreviews, user]);

  return {
    conversations,
    loading,
    refreshConversations: loadConversationPreviews
  };
};
