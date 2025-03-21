
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
    if (!user) return;
    
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
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // Charger au démarrage
  useEffect(() => {
    loadConversationPreviews();
  }, [loadConversationPreviews]);

  return {
    conversations,
    loading,
    refreshConversations: loadConversationPreviews
  };
};
