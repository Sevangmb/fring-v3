
/**
 * Utilise l'API Google AI (Gemini) pour analyser les images
 */

/**
 * Détecte la couleur et la catégorie d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Informations du vêtement détecté (couleur et catégorie)
 */
export async function detectClothingInfo(imageUrl: string): Promise<{color: string, category: string}> {
  try {
    console.log("Starting clothing detection process with Google AI (Gemini)");
    
    // Récupérer la clé API Google AI de l'environnement
    const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
    if (!googleApiKey) {
      console.error("GOOGLE_API_KEY not found in environment variables");
      throw new Error("Configuration API Google AI manquante");
    }
    
    console.log("Google AI API key retrieved from environment");

    // Vérifier si l'image est au format base64 ou URL
    const isBase64Image = imageUrl.startsWith('data:');
    console.log(`Image format: ${isBase64Image ? 'base64' : 'URL'}`);
    
    // Préparer l'image - pour Gemini, on peut passer directement les données base64
    const processedImage = imageUrl;
    
    // Créer un prompt pour l'analyse d'image
    const imageAnalysisPrompt = `
    Observe attentivement cette image de vêtement et réponds UNIQUEMENT à ces deux questions:
    1. Quelle est la COULEUR PRINCIPALE du vêtement? (un seul mot)
    2. De quelle CATÉGORIE de vêtement s'agit-il? (t-shirt, chemise, pantalon, etc.)
    
    Format de ta réponse (EXACTEMENT):
    COULEUR: [couleur]
    CATÉGORIE: [catégorie]
    
    Sois très précis et réponds UNIQUEMENT dans ce format.
    `;
    
    console.log("Preparing request to Google AI Gemini API");
    
    // Construction du payload pour l'API Gemini
    const requestPayload = {
      contents: [
        {
          parts: [
            { text: imageAnalysisPrompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: isBase64Image 
                  ? processedImage.split(',')[1] // Extraire la partie base64 sans le préfixe
                  : processedImage // URL directe si ce n'est pas du base64
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 100,
      }
    };
    
    // Si l'image est une URL et non du base64, ajuster le payload
    if (!isBase64Image) {
      requestPayload.contents[0].parts[1] = {
        file_data: {
          mime_type: "image/jpeg",
          file_uri: processedImage
        }
      };
    }
    
    console.log("Sending request to Google AI Gemini API...");
    
    // Faire une requête à l'API Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${googleApiKey}`, 
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
    const generatedText = result.candidates[0].content.parts[0].text.toLowerCase();
    console.log("Google AI detection response:", generatedText);
    
    // Extraire la couleur avec regex
    const colorMatch = generatedText.match(/couleur:\s*([a-zéèêëàâäôöùûüç]+)/i);
    const color = colorMatch?.[1] || null;
    
    if (!color) {
      console.error("Could not extract color from response:", generatedText);
      throw new Error("Impossible de détecter la couleur du vêtement");
    }
    
    // Extraire la catégorie avec regex
    const categoryMatch = generatedText.match(/catégorie:\s*([a-zéèêëàâäôöùûüç\s-]+)/i);
    const category = categoryMatch?.[1]?.trim() || null;
    
    if (!category) {
      console.error("Could not extract category from response:", generatedText);
      throw new Error("Impossible de détecter la catégorie du vêtement");
    }
    
    // Normalisation des couleurs en français
    const colorMapping: Record<string, string> = {
      "bleu": "bleu",
      "rouge": "rouge",
      "vert": "vert", 
      "jaune": "jaune",
      "noir": "noir",
      "blanc": "blanc",
      "gris": "gris",
      "violet": "violet",
      "rose": "rose",
      "orange": "orange",
      "marron": "marron",
      "beige": "beige",
      "blue": "bleu",
      "red": "rouge",
      "green": "vert",
      "yellow": "jaune",
      "black": "noir", 
      "white": "blanc",
      "gray": "gris",
      "grey": "gris",
      "purple": "violet",
      "pink": "rose",
      "brown": "marron"
    };
    
    // Normalisation des catégories en français
    const categoryMapping: Record<string, string> = {
      "t-shirt": "T-shirt",
      "tshirt": "T-shirt",
      "t shirt": "T-shirt",
      "shirt": "Chemise", 
      "chemise": "Chemise",
      "pants": "Pantalon",
      "pantalon": "Pantalon",
      "jeans": "Jeans",
      "jean": "Jeans",
      "shorts": "Short",
      "short": "Short",
      "dress": "Robe",
      "robe": "Robe",
      "skirt": "Jupe",
      "jupe": "Jupe",
      "jacket": "Veste",
      "veste": "Veste",
      "coat": "Manteau",
      "manteau": "Manteau",
      "sweater": "Pull",
      "pull": "Pull",
      "hoodie": "Pull",
      "sweatshirt": "Pull"
    };
    
    // Normaliser la couleur
    const normalizedColor = colorMapping[color] || color;
    
    // Normaliser la catégorie
    let normalizedCategory = "T-shirt"; // Valeur par défaut
    for (const [key, value] of Object.entries(categoryMapping)) {
      if (category.includes(key)) {
        normalizedCategory = value;
        break;
      }
    }
    
    console.log("Detected color:", color);
    console.log("Normalized color:", normalizedColor);
    console.log("Detected category:", category);
    console.log("Normalized category:", normalizedCategory);
    
    return {
      color: normalizedColor,
      category: normalizedCategory
    };
  } catch (error) {
    console.error("Critical error in detectClothingInfo:", error);
    throw new Error("La détection d'image a échoué: " + (error instanceof Error ? error.message : "Erreur inconnue"));
  }
}
