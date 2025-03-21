
import { Message, fetchConversation, sendMessage as apiSendMessage, markMessagesAsRead, fetchConversationPreviews, countUnreadMessages } from '@/services/messagesService';
import { getUserEmailById } from '@/services/amis/userEmail';

// Enrichir les messages avec l'email de l'expéditeur
export const enrichMessagesWithEmail = async (messages: Message[]): Promise<Message[]> => {
  return Promise.all(
    messages.map(async (message) => {
      const senderId = message.sender_id;
      try {
        const email = await getUserEmailById(senderId);
        return { ...message, sender_email: email };
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'email pour ${senderId}:`, error);
        return { ...message, sender_email: 'Utilisateur inconnu' };
      }
    })
  );
};

// Charger les messages d'une conversation
export const loadConversationMessages = async (
  userId: string | undefined,
  friendId: string | undefined
): Promise<Message[]> => {
  if (!userId || !friendId) return [];
  
  const conversationMessages = await fetchConversation(friendId);
  return enrichMessagesWithEmail(conversationMessages);
};

// Marquer comme lus
export const markAsRead = async (friendId: string | undefined): Promise<void> => {
  if (!friendId) return;
  
  try {
    await markMessagesAsRead(friendId);
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus:', error);
    throw error;
  }
};

// Récupérer les aperçus de conversation
export const loadConversationPreviewsWithEmail = async (
  userId: string | undefined
): Promise<Message[]> => {
  if (!userId) return [];
  
  const previews = await fetchConversationPreviews();
  
  return Promise.all(
    previews.map(async (preview) => {
      const otherUserId = preview.sender_id === userId ? preview.receiver_id : preview.sender_id;
      try {
        const email = await getUserEmailById(otherUserId);
        return { ...preview, sender_email: email };
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'email pour ${otherUserId}:`, error);
        return { ...preview, sender_email: 'Utilisateur inconnu' };
      }
    })
  );
};

// Envoyer un message
export const sendNewMessage = async (
  userId: string | undefined,
  friendId: string | undefined,
  content: string
): Promise<Message | null> => {
  if (!userId || !friendId || !content.trim()) return null;
  
  const newMessage = await apiSendMessage(friendId, content.trim());
  const email = await getUserEmailById(newMessage.sender_id);
  
  return { ...newMessage, sender_email: email };
};
