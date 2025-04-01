
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { countUnreadMessages } from '@/services/messagesService';

export const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fonction pour rafraîchir le compteur de messages non lus
  const refreshUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    try {
      const count = await countUnreadMessages();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
    }
  }, [user]);

  // Rafraîchir au démarrage et quand l'utilisateur change
  useEffect(() => {
    refreshUnreadCount();
    
    // Mettre en place un intervalle pour rafraîchir périodiquement
    const interval = setInterval(refreshUnreadCount, 30000); // 30 secondes
    
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  return { unreadCount, refreshUnreadCount };
};
