
import { Message, fetchConversation, sendMessage as apiSendMessage, markMessagesAsRead, fetchConversationPreviews } from '@/services/messagesService';
import { getUserEmailById, getUserIdByEmail, isEmail } from '@/services/amis/userEmail';

// Cache pour les résolutions d'ID/email
const resolutionCache: Record<string, {id: string, email: string}> = {};

// Résoudre un identifiant (email ou ID)
export const resolveIdentifier = async (identifier: string): Promise<{id: string | null, email: string | null}> => {
  if (!identifier) return { id: null, email: null };
  
  // Vérifier le cache
  if (resolutionCache[identifier]) {
    return {
      id: resolutionCache[identifier].id,
      email: resolutionCache[identifier].email
    };
  }
  
  try {
    // Si c'est un email
    if (isEmail(identifier)) {
      const id = await getUserIdByEmail(identifier);
      if (id) {
        resolutionCache[identifier] = { id, email: identifier };
        resolutionCache[id] = { id, email: identifier };
        return { id, email: identifier };
      }
    }
    
    // Si c'est un ID
    else if (identifier.includes('-') && identifier.length > 30) {
      const email = await getUserEmailById(identifier);
      if (email) {
        resolutionCache[identifier] = { id: identifier, email };
        if (isEmail(email)) resolutionCache[email] = { id: identifier, email };
        return { id: identifier, email };
      }
    }
    
    return { id: null, email: null };
  } catch (error) {
    console.error('Erreur lors de la résolution de l\'identifiant:', error);
    return { id: null, email: null };
  }
};

// Enrichir les messages avec l'email de l'expéditeur
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
            if (isEmail(email)) resolutionCache[email] = { id: senderId, email };
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

// Charger les messages d'une conversation
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
      const resolvedId = await getUserIdByEmail(friendIdOrEmail);
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

// Marquer comme lus
export const markAsRead = async (friendIdOrEmail: string | undefined): Promise<void> => {
  if (!friendIdOrEmail) {
    console.log("Impossible de marquer comme lu: ami manquant");
    return;
  }
  
  try {
    // Résoudre l'identifiant si c'est un email
    let friendId = friendIdOrEmail;
    
    if (isEmail(friendIdOrEmail)) {
      const resolvedId = await getUserIdByEmail(friendIdOrEmail);
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
          // Vérifier si l'email est déjà dans le cache de résolution
          if (resolutionCache[otherUserId]) {
            return { ...preview, sender_email: resolutionCache[otherUserId].email };
          }
          
          const email = await getUserEmailById(otherUserId);
          
          if (email && otherUserId) {
            resolutionCache[otherUserId] = { id: otherUserId, email };
            if (isEmail(email)) resolutionCache[email] = { id: otherUserId, email };
          }
          
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
      const resolvedId = await getUserIdByEmail(friendIdOrEmail);
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
