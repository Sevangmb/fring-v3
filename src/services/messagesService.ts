
import { supabase } from '@/lib/supabase';

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  // Propriétés pour l'affichage
  sender_email?: string;
}

// Récupérer les messages d'une conversation
export const fetchConversation = async (userId: string): Promise<Message[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;

    if (!currentUserId) {
      throw new Error('Vous devez être connecté pour voir les messages');
    }

    // Récupérer les messages entre les deux utilisateurs (envoyés et reçus)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUserId})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des messages:', error);
      throw error;
    }

    return data as Message[];
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    throw error;
  }
};

// Envoyer un message
export const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const senderId = sessionData.session?.user?.id;

    if (!senderId) {
      throw new Error('Vous devez être connecté pour envoyer un message');
    }

    // Insérer le nouveau message
    const { data, error } = await supabase
      .from('messages')
      .insert([
        {
          sender_id: senderId,
          receiver_id: receiverId,
          content: content,
          read: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      throw error;
    }

    return data as Message;
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};

// Marquer les messages comme lus
export const markMessagesAsRead = async (senderId: string): Promise<void> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData.session?.user?.id;

    if (!currentUserId) {
      throw new Error('Vous devez être connecté pour mettre à jour les messages');
    }

    // Mettre à jour tous les messages non lus de l'expéditeur
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('sender_id', senderId)
      .eq('receiver_id', currentUserId)
      .eq('read', false);

    if (error) {
      console.error('Erreur lors de la mise à jour des messages:', error);
      throw error;
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des messages:', error);
    throw error;
  }
};

// Récupérer les derniers messages de chaque conversation
export const fetchConversationPreviews = async (): Promise<Message[]> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      throw new Error('Vous devez être connecté pour voir les conversations');
    }

    // Récupérer les derniers messages pour chaque conversation
    // Ceci utilise une requête SQL brute via RPC pour obtenir le dernier message de chaque conversation
    const { data, error } = await supabase.rpc('get_conversation_previews');
    
    if (error) {
      console.error('Erreur lors de la récupération des aperçus de conversation:', error);
      
      // Méthode de secours si la RPC n'existe pas encore
      console.log('Utilisation de la méthode de secours pour les aperçus de conversation');
      
      // Récupérer tous les messages où l'utilisateur est impliqué
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Erreur lors de la récupération des messages:', messagesError);
        throw messagesError;
      }
      
      // Créer un ensemble d'IDs d'utilisateurs uniques
      const userIds = new Set<string>();
      const conversationPreviews: Message[] = [];
      
      // Filtrer pour ne garder que le dernier message de chaque conversation
      messagesData?.forEach(message => {
        const otherId = message.sender_id === userId ? message.receiver_id : message.sender_id;
        
        if (!userIds.has(otherId)) {
          userIds.add(otherId);
          conversationPreviews.push(message);
        }
      });
      
      return conversationPreviews as Message[];
    }

    return data as Message[];
  } catch (error) {
    console.error('Erreur lors de la récupération des aperçus de conversation:', error);
    throw error;
  }
};

// Compter les messages non lus
export const countUnreadMessages = async (): Promise<number> => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user?.id;

    if (!userId) {
      return 0;
    }

    // Compter les messages non lus
    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('receiver_id', userId)
      .eq('read', false);

    if (error) {
      console.error('Erreur lors du comptage des messages non lus:', error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error('Erreur lors du comptage des messages non lus:', error);
    return 0;
  }
};
