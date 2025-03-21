
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { countUnreadMessages } from '@/services/messagesService';

export const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Compter les messages non lus
  const loadUnreadCount = useCallback(async () => {
    if (!user) {
      setUnreadCount(0);
      return;
    }
    
    try {
      const count = await countUnreadMessages();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      setUnreadCount(0);
    }
  }, [user]);

  // Charger au démarrage et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    if (user) {
      loadUnreadCount();
      
      // Rafraîchir le compteur toutes les 15 secondes
      const interval = setInterval(loadUnreadCount, 15000);
      return () => clearInterval(interval);
    } else {
      setUnreadCount(0);
    }
  }, [user, loadUnreadCount]);

  return {
    unreadCount,
    refreshUnreadCount: loadUnreadCount
  };
};
