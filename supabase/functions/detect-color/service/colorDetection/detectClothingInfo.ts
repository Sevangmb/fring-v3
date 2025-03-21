
/**
 * Utilise l'API Mistral pour analyser les images via une implémentation directe de l'API
 * plutôt que d'utiliser la bibliothèque client qui n'est pas compatible avec Deno
 */

/**
 * Détecte la couleur et la catégorie d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Informations du vêtement détecté (couleur et catégorie)
 */
export async function detectClothingInfo(imageUrl: string): Promise<{color: string, category: string}> {
  try {
    console.log("Starting clothing detection process with Mistral AI");
    
    // Récupérer la clé API Mistral de l'environnement
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
    if (!mistralApiKey) {
      console.error("MISTRAL_API_KEY not found in environment variables");
      throw new Error("Configuration API Mistral manquante");
    }
    
    console.log("Mistral AI API key retrieved from environment");

    // Préparer l'image au bon format (gestion du base64)
    const processedImage = imageUrl;
    
    // Utiliser l'API Mistral directement au lieu d'utiliser la bibliothèque client
    const imageAnalysisPrompt = `
    Observe attentivement cette image de vêtement et réponds UNIQUEMENT à ces deux questions:
    1. Quelle est la COULEUR PRINCIPALE du vêtement? (un seul mot)
    2. De quelle CATÉGORIE de vêtement s'agit-il? (t-shirt, chemise, pantalon, etc.)
    
    Format de ta réponse (EXACTEMENT):
    COULEUR: [couleur]
    CATÉGORIE: [catégorie]
    
    Sois très précis et réponds UNIQUEMENT dans ce format.
    `;
    
    console.log("Preparing request to Mistral AI API");
    
    // Faire une requête directe à l'API Mistral au lieu d'utiliser la bibliothèque
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${mistralApiKey}`
      },
      body: JSON.stringify({
        model: "mistral-large-latest", // Utilisation du modèle Mistral le plus récent
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: imageAnalysisPrompt
              },
              {
                type: "image_url",
                image_url: processedImage
              }
            ]
          }
        ],
        temperature: 0.1 // Température réduite pour plus de précision
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mistral AI API error:", response.status, errorText);
      throw new Error(`Erreur API Mistral: ${response.status} ${errorText}`);
    }
    
    const result = await response.json();
    console.log("Mistral AI API response received");
    
    const generatedText = result.choices[0].message.content.toLowerCase();
    console.log("Mistral AI detection response:", generatedText);
    
    // Extraire la couleur avec regex
    const colorMatch = generatedText.match(/couleur:\s*([a-zéèêëàâäôöùûüç]+)/i);
    const color = colorMatch?.[1] || null;
    
    if (!color) {
      throw new Error("Impossible de détecter la couleur du vêtement");
    }
    
    // Extraire la catégorie avec regex
    const categoryMatch = generatedText.match(/catégorie:\s*([a-zéèêëàâäôöùûüç\s-]+)/i);
    const category = categoryMatch?.[1]?.trim() || null;
    
    if (!category) {
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
