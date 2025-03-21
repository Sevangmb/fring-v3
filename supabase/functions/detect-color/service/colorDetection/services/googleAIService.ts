
/**
 * Service pour interagir avec l'API Google AI (Gemini)
 */

/**
 * Envoie une requête à l'API Google AI Gemini pour analyser une image
 * @param imageUrl URL ou base64 de l'image
 * @param prompt Prompt d'instruction pour l'analyse
 * @param apiKey Clé API Google AI
 * @returns Réponse de l'API
 */
export async function requestGoogleAIAnalysis(
  imageUrl: string,
  prompt: string,
  apiKey: string
): Promise<string> {
  console.log("Preparing request to Google AI Gemini API");
  
  // Vérifier si l'image est au format base64 ou URL
  const isBase64Image = imageUrl.startsWith('data:');
  console.log(`Image format: ${isBase64Image ? 'base64' : 'URL'}`);
  
  // Construction du payload pour l'API Gemini
  const requestPayload = {
    contents: [
      {
        parts: [
          { text: prompt },
          isBase64Image
            ? {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageUrl.split(',')[1] // Extraire la partie base64 sans le préfixe
                }
              }
            : {
                file_data: {
                  mime_type: "image/jpeg",
                  file_uri: imageUrl
                }
              }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 200,
    }
  };
  
  console.log("Sending request to Google AI Gemini API...");
  
  // Faire une requête à l'API Gemini
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestPayload)
    }
  );
  
  // Vérifier le statut de la réponse
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Google AI API error ${response.status}:`, errorText);
    throw new Error(`Erreur API Google AI: ${response.status} - ${errorText}`);
  }
  
  // Traiter la réponse
  const result = await response.json();
  console.log("Google AI API response received successfully");
  
  if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts) {
    console.error("Invalid response structure from Google AI:", JSON.stringify(result));
    throw new Error("Structure de réponse Google AI invalide");
  }
  
  // Extraire le texte généré
  return result.candidates[0].content.parts[0].text;
}
