
import { Message, fetchConversation, fetchConversationPreviews } from '@/services/messagesService';
import { enrichMessagesWithEmail } from './messageEnricher';
import { resolveToId } from './identifierResolver';
import { isEmail } from '@/services/amis/userEmail';

/**
 * Charge les messages d'une conversation
 */
export const loadConversationMessages = async (
  userId: string | undefined,
  friendIdOrEmail: string | undefined
): Promise<Message[]> => {
  if (!userId || !friendIdOrEmail) {
    console.log("Impossible de charger les messages: utilisateur ou ami manquant");
    return [];
  }
  
  try {
    console.log(`Chargement des messages pour la conversation avec ${friendIdOrEmail}`);
    
    // Résoudre l'identifiant si c'est un email
    let friendId = friendIdOrEmail;
    
    if (isEmail(friendIdOrEmail)) {
      const resolvedId = await resolveToId(friendIdOrEmail);
      if (resolvedId) {
        friendId = resolvedId;
        console.log(`Email ${friendIdOrEmail} résolu en ID ${resolvedId}`);
      } else {
        console.error(`Impossible de résoudre l'email ${friendIdOrEmail}`);
        return [];
      }
    }
    
    const conversationMessages = await fetchConversation(friendId);
    console.log(`${conversationMessages.length} messages récupérés, enrichissement avec les emails`);
    return await enrichMessagesWithEmail(conversationMessages);
  } catch (error) {
    console.error('Erreur lors du chargement des messages:', error);
    return [];
  }
};

/**
 * Récupère les aperçus de conversation avec emails enrichis
 */
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
    
    return enrichMessagesWithEmail(previews);
  } catch (error) {
    console.error('Erreur lors du chargement des aperçus de conversation:', error);
    return [];
  }
};
