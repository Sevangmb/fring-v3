
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationPreviewsWithEmail } from './messageOperations';

export const useConversationList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les aperçus de conversation
  const loadConversationPreviews = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const enrichedPreviews = await loadConversationPreviewsWithEmail(user.id);
      setConversations(enrichedPreviews);
    } catch (error: any) {
      console.error('Erreur lors du chargement des aperçus de conversation:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de charger les conversations',
        variant: 'destructive',
      });
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Charger au démarrage et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    loadConversationPreviews();
    
    if (user) {
      // Rafraîchir les conversations toutes les 10 secondes
      const interval = setInterval(loadConversationPreviews, 10000);
      return () => clearInterval(interval);
    }
  }, [loadConversationPreviews, user]);

  return {
    conversations,
    loading,
    refreshConversations: loadConversationPreviews
  };
};
