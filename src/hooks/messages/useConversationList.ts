
import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Message } from '@/services/messagesService';
import { loadConversationPreviewsWithEmail } from './conversationLoader';

export const useConversationList = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const lastLoadedRef = useRef<string | null>(null);
  const loadingRef = useRef(false); // Référence pour suivre l'état de chargement

  // Charger les aperçus de conversation
  const loadConversationPreviews = useCallback(async (silent = false) => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }
    
    // Éviter de charger plusieurs fois le même utilisateur ou si un chargement est déjà en cours
    if ((lastLoadedRef.current === user.id && conversations.length > 0 && !silent) || loadingRef.current) {
      return;
    }
    
    try {
      // Marquer comme en cours de chargement
      loadingRef.current = true;
      if (!silent) setLoading(true);
      
      console.log("Chargement des aperçus de conversation pour", user.email);
      const enrichedPreviews = await loadConversationPreviewsWithEmail(user.id);
      lastLoadedRef.current = user.id;
      
      // Ne mettre à jour les conversations que si elles sont différentes
      const newPreviewsJson = JSON.stringify(enrichedPreviews);
      const currentPreviewsJson = JSON.stringify(conversations);
      
      if (newPreviewsJson !== currentPreviewsJson) {
        console.log("Mise à jour des aperçus de conversation:", enrichedPreviews.length);
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
      // Marquer comme chargement terminé
      loadingRef.current = false;
      if (!silent) setLoading(false);
    }
  }, [user, toast, conversations]);

  // Charger uniquement au démarrage, sans intervalle de rafraîchissement
  useEffect(() => {
    if (user) {
      loadConversationPreviews();
    } else {
      setConversations([]);
      setLoading(false);
    }
  }, [user, loadConversationPreviews]);

  return {
    conversations,
    loading,
    refreshConversations: () => loadConversationPreviews(false)
  };
};
