
import { Message, markMessagesAsRead, sendMessage as apiSendMessage } from '@/services/messagesService';
import { resolveToId } from './identifierResolver';
import { getUserEmailById, isEmail } from '@/services/amis/userEmail';
import { resolutionCache } from './identifierResolver';

/**
 * Marque les messages d'un ami comme lus
 */
export const markAsRead = async (friendIdOrEmail: string | undefined): Promise<void> => {
  if (!friendIdOrEmail) {
    console.log("Impossible de marquer comme lu: ami manquant");
    return;
  }
  
  try {
    // Résoudre l'identifiant si c'est un email
    let friendId = friendIdOrEmail;
    
    if (isEmail(friendIdOrEmail)) {
      const resolvedId = await resolveToId(friendIdOrEmail);
      if (resolvedId) {
        friendId = resolvedId;
      } else {
        console.error(`Impossible de résoudre l'email ${friendIdOrEmail}`);
        return;
      }
    }
    
    console.log(`Marquage des messages de ${friendId} comme lus`);
    await markMessagesAsRead(friendId);
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus:', error);
    throw error;
  }
};

/**
 * Envoie un nouveau message
 */
export const sendNewMessage = async (
  userId: string | undefined,
  friendIdOrEmail: string | undefined,
  content: string
): Promise<Message | null> => {
  if (!userId || !friendIdOrEmail || !content.trim()) {
    console.error("Impossible d'envoyer le message: utilisateur, destinataire ou contenu manquant");
    return null;
  }
  
  try {
    // Résoudre l'identifiant si c'est un email
    let friendId = friendIdOrEmail;
    
    if (isEmail(friendIdOrEmail)) {
      const resolvedId = await resolveToId(friendIdOrEmail);
      if (resolvedId) {
        friendId = resolvedId;
        console.log(`Email ${friendIdOrEmail} résolu en ID ${resolvedId}`);
      } else {
        console.error(`Impossible de résoudre l'email ${friendIdOrEmail}`);
        throw new Error(`Utilisateur introuvable: ${friendIdOrEmail}`);
      }
    }
    
    console.log(`Envoi d'un message de ${userId} à ${friendId}: ${content}`);
    const newMessage = await apiSendMessage(friendId, content.trim());
    
    // Enrichir le message avec l'email de l'expéditeur
    const email = await getUserEmailById(newMessage.sender_id);
    
    if (newMessage.sender_id) {
      resolutionCache[newMessage.sender_id] = { 
        id: newMessage.sender_id, 
        email: email || 'Utilisateur inconnu' 
      };
    }
    
    console.log("Message envoyé avec succès, enrichi avec l'email");
    return { ...newMessage, sender_email: email };
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    throw error;
  }
};
