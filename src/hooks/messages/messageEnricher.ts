
import { Message } from '@/services/messagesService';
import { getUserEmailById } from '@/services/amis/userEmail';
import { resolutionCache } from './identifierResolver';

/**
 * Enrichit les messages avec l'email de l'expéditeur
 */
export const enrichMessagesWithEmail = async (messages: Message[]): Promise<Message[]> => {
  try {
    console.log(`Enrichissement de ${messages.length} messages avec les emails`);
    return Promise.all(
      messages.map(async (message) => {
        const senderId = message.sender_id;
        try {
          // Vérifier si l'email est déjà dans le cache de résolution
          if (resolutionCache[senderId]) {
            return { ...message, sender_email: resolutionCache[senderId].email };
          }
          
          const email = await getUserEmailById(senderId);
          
          if (email && senderId) {
            resolutionCache[senderId] = { id: senderId, email };
            resolutionCache[email] = { id: senderId, email };
          }
          
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
