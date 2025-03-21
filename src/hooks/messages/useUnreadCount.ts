
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { countUnreadMessages } from '@/services/messagesService';

export const useUnreadCount = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  // Compter les messages non lus
  const loadUnreadCount = useCallback(async () => {
    if (!user) return;
    
    try {
      const count = await countUnreadMessages();
      setUnreadCount(count);
    } catch (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
    }
  }, [user]);

  // Charger au démarrage et configurer l'intervalle de rafraîchissement
  useEffect(() => {
    if (user) {
      loadUnreadCount();
      
      // Rafraîchir le compteur toutes les 30 secondes
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, loadUnreadCount]);

  return {
    unreadCount,
    refreshUnreadCount: loadUnreadCount
  };
};
