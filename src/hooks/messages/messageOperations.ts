
import { Message, fetchConversation, sendMessage as apiSendMessage, markMessagesAsRead, fetchConversationPreviews } from '@/services/messagesService';
import { getUserEmailById } from '@/services/amis/userEmail';

// Enrichir les messages avec l'email de l'expéditeur
export const enrichMessagesWithEmail = async (messages: Message[]): Promise<Message[]> => {
  try {
    console.log(`Enrichissement de ${messages.length} messages avec les emails`);
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
  } catch (error) {
    console.error('Erreur lors de l\'enrichissement des messages:', error);
    return messages;
  }
};

// Charger les messages d'une conversation
export const loadConversationMessages = async (
  userId: string | undefined,
  friendId: string | undefined
): Promise<Message[]> => {
  if (!userId || !friendId) {
    console.log("Impossible de charger les messages: utilisateur ou ami manquant");
    return [];
  }
  
  try {
    console.log(`Chargement des messages entre ${userId} et ${friendId}`);
    const conversationMessages = await fetchConversation(friendId);
    console.log(`${conversationMessages.length} messages récupérés, enrichissement avec les emails`);
    return await enrichMessagesWithEmail(conversationMessages);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    return [];
  }
};

// Marquer comme lus
export const markAsRead = async (friendId: string | undefined): Promise<void> => {
  if (!friendId) {
    console.log("Impossible de marquer comme lu: ami manquant");
    return;
  }
  
  try {
    console.log(`Marquage des messages de ${friendId} comme lus`);
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
  if (!userId) {
    console.log("Impossible de charger les aperçus: utilisateur manquant");
    return [];
  }
  
  try {
    console.log(`Chargement des aperçus de conversation pour ${userId}`);
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
  } catch (error) {
    console.error('Erreur lors du chargement des aperçus de conversation:', error);
    return [];
  }
};

// Envoyer un message
export const sendNewMessage = async (
  userId: string | undefined,
  friendId: string | undefined,
  content: string
): Promise<Message | null> => {
  if (!userId || !friendId || !content.trim()) {
    console.error("Impossible d'envoyer le message: utilisateur, destinataire ou contenu manquant");
    return null;
  }
  
  try {
    console.log(`Envoi d'un message de ${userId} à ${friendId}: ${content}`);
    const newMessage = await apiSendMessage(friendId, content.trim());
    const email = await getUserEmailById(newMessage.sender_id);
    
    console.log("Message envoyé avec succès, enrichi avec l'email");
    return { ...newMessage, sender_email: email };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};
