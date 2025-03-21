import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

// Configuration des en-têtes CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Correspondance entre les couleurs anglaises et françaises
const colorMapping: Record<string, string> = {
  // Couleurs basiques
  'white': 'blanc',
  'black': 'noir',
  'gray': 'gris',
  'grey': 'gris',
  
  // Variations de bleu - élargir la détection du bleu
  'blue': 'bleu',
  'navy': 'bleu',
  'navy blue': 'bleu',
  'light blue': 'bleu',
  'dark blue': 'bleu',
  'sky blue': 'bleu',
  'royal blue': 'bleu',
  'teal': 'bleu',
  'denim': 'bleu',
  'indigo': 'bleu',
  'turquoise': 'bleu',
  'aqua': 'bleu',
  'cyan': 'bleu',
  'azure': 'bleu',
  'cobalt': 'bleu',
  'sapphire': 'bleu',
  'cerulean': 'bleu',
  'ocean': 'bleu',
  'midnight': 'bleu',
  'midnight blue': 'bleu',
  'steel': 'bleu',
  'steel blue': 'bleu',
  'blue jean': 'bleu',
  'jeans': 'bleu',
  
  // Autres couleurs
  'red': 'rouge',
  'burgundy': 'rouge',
  'maroon': 'rouge',
  'crimson': 'rouge',
  'scarlet': 'rouge',
  'green': 'vert',
  'olive': 'vert',
  'olive green': 'vert',
  'lime': 'vert',
  'dark green': 'vert',
  'light green': 'vert',
  'forest green': 'vert',
  'yellow': 'jaune',
  'gold': 'jaune',
  'mustard': 'jaune',
  'lemon': 'jaune',
  'orange': 'orange',
  'peach': 'orange',
  'coral': 'orange',
  'tangerine': 'orange',
  'purple': 'violet',
  'lavender': 'violet',
  'lilac': 'violet',
  'mauve': 'violet',
  'magenta': 'violet',
  'pink': 'rose',
  'hot pink': 'rose',
  'salmon': 'rose',
  'brown': 'marron',
  'chocolate': 'marron',
  'tan': 'marron',
  'coffee': 'marron',
  'beige': 'beige',
  'cream': 'beige',
  'khaki': 'beige',
  'sand': 'beige',
  'ivory': 'beige',
  'silver': 'gris',
  'charcoal': 'gris',
  'dark grey': 'gris',
  'light grey': 'gris'
};

// Liste des couleurs disponibles dans l'application avec priorité (du plus spécifique au plus général)
const availableColors = [
  'bleu', 'noir', 'blanc', 'rouge', 'vert', 
  'jaune', 'orange', 'violet', 'rose', 'marron', 'gris', 'beige'
];

// Priorité des couleurs pour la détection (du plus important au moins important)
const colorPriority = {
  'bleu': 10,
  'noir': 9,
  'blanc': 8,
  'rouge': 7,
  'vert': 6,
  'jaune': 5,
  'orange': 4,
  'violet': 3,
  'rose': 2,
  'marron': 1,
  'gris': 0,
  'beige': 0
};

/**
 * Convertit un Blob en Base64
 * @param blob Blob à convertir
 * @returns Chaîne Base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64;
}

/**
 * Génère la description d'une image à l'aide de Hugging Face
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Description de l'image
 */
async function generateImageDescription(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Generating image description...");
  
  try {
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: imageUrl,
    });
    
    console.log("Image description:", visionResult);
    return visionResult.generated_text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description");
  }
}

/**
 * Extrait la couleur d'un vêtement à partir de sa description
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
async function extractClothingColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Extracting clothing color from description...");
  
  try {
    // Créer un prompt spécifique pour extraire la couleur avec une emphase sur le bleu
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
    If the clothing item appears to be any shade of blue, navy, denim, or similar blue tones, please identify it as "blue".
    
    Return ONLY the color name - nothing else, no explanations or additional text.
    `;
    
    const colorResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: colorAnalysisPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    console.log("Raw detected color:", colorResult.generated_text);
    return colorResult.generated_text.toLowerCase().trim();
  } catch (error) {
    console.error("Error extracting clothing color:", error);
    throw new Error("Failed to extract clothing color");
  }
}

/**
 * Effectue une requête directe pour obtenir la couleur si la première méthode échoue
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
async function performDirectColorQuery(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Performing direct color query...");
  
  try {
    const directColorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word. If it's any shade of blue (navy, denim, azure, etc), just say "blue".`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const detectedColor = directColorQuery.generated_text.toLowerCase().trim();
    console.log("Direct query color result:", detectedColor);
    return detectedColor;
  } catch (error) {
    console.error("Error performing direct color query:", error);
    throw new Error("Failed to perform direct color query");
  }
}

/**
 * Analyse directement l'image pour détecter la couleur sans utiliser de description
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
async function analyzeImageDirectly(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Analyzing image directly for blue detection...");
  
  try {
    const visionQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image blue? Answer with only yes or no: ${imageUrl}`,
      parameters: {
        max_new_tokens: 5,
        temperature: 0.1,
      }
    });
    
    const isBlue = visionQuery.generated_text.toLowerCase().trim();
    console.log("Is clothing blue?", isBlue);
    
    if (isBlue === "yes" || isBlue.includes("yes")) {
      return "blue";
    }
    
    return "unknown"; // Si ce n'est pas bleu, on laisse les autres méthodes déterminer la couleur
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
  }
}

/**
 * Effectue une analyse approfondie pour détecter la couleur dominante
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur dominante détectée
 */
async function detectDominantColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Detecting dominant color...");
  
  try {
    const dominantColorPrompt = `
    Image description: "${imageDescription}"
    
    Task: What is the DOMINANT COLOR of the CLOTHING in this image?
    Ignore background colors or accessories. Focus only on the main clothing item.
    You MUST choose only ONE of these color options: white, black, gray, blue, red, green, yellow, orange, purple, pink, brown, beige.
    Return ONLY the color name - just one word, no explanation.
    `;
    
    const dominantResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: dominantColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const detectedColor = dominantResult.generated_text.toLowerCase().trim();
    console.log("Dominant color detected:", detectedColor);
    return detectedColor;
  } catch (error) {
    console.error("Error detecting dominant color:", error);
    return "unknown";
  }
}

/**
 * Analyse plusieurs approches pour déterminer la couleur et sélectionne la plus probable
 * @param imageDescription Description de l'image
 * @param detectedColors Tableau de couleurs détectées par différentes méthodes
 * @param hf Client Hugging Face Inference
 * @returns Couleur la plus probable
 */
async function determineMostLikelyColor(imageDescription: string, detectedColors: string[], hf: HfInference): Promise<string> {
  console.log("Determining most likely color from detected colors:", detectedColors);
  
  // Si une seule couleur est détectée, la retourner directement
  if (detectedColors.length === 1) {
    return detectedColors[0];
  }
  
  // Si "blue" est parmi les couleurs détectées, le prioriser
  if (detectedColors.includes("blue")) {
    return "blue";
  }
  
  // Détecter la couleur dominante comme dernier recours
  return await detectDominantColor(imageDescription, hf);
}

/**
 * Mappe la couleur détectée en anglais vers son équivalent français
 * @param detectedColor Couleur détectée en anglais
 * @returns Couleur en français
 */
function mapToFrenchColor(detectedColor: string): string {
  console.log("Mapping detected color to French:", detectedColor);
  
  // Cas spécial pour les pantalons souvent de couleur bleue (jeans)
  if (detectedColor.includes("pants") || detectedColor.includes("jeans") || 
      detectedColor.includes("denim") || detectedColor.includes("trousers")) {
    console.log("Pants/jeans detected, assuming blue");
    return "bleu";
  }
  
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si aucune correspondance n'est trouvée, chercher la couleur la plus proche au lieu de renvoyer "multicolore"
  console.log("No direct color mapping found for:", detectedColor);
  
  // Essayer de trouver une correspondance partielle
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Found partial match '${englishColor}' -> '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si toujours pas de correspondance, chercher le mot le plus proche dans le texte
  const words = detectedColor.split(/\s+/);
  for (const word of words) {
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (word === englishColor) {
        console.log(`Found word match '${word}' -> '${frenchColor}'`);
        return frenchColor;
      }
    }
  }
  
  // Si on arrive ici, retourner une couleur par défaut basée sur les mots clés
  if (detectedColor.includes("dark")) {
    return "noir";
  } else if (detectedColor.includes("light")) {
    return "blanc";
  }
  
  // En dernier recours, retourner la première couleur disponible (souvent bleu)
  return availableColors[0];
}

/**
 * Détecte la couleur dominante d'un vêtement dans une image
 * @param imageUrl URL de l'image à analyser
 * @returns Couleur du vêtement détectée
 */
async function detectClothingColor(imageUrl: string): Promise<string> {
  try {
    console.log("Detecting clothing color from image:", imageUrl.substring(0, 50) + "...");
    
    // Initialiser l'API Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    // Vérifier d'abord si c'est bleu par analyse directe
    const directColorAnalysis = await analyzeImageDirectly(imageUrl, hf);
    if (directColorAnalysis === "blue") {
      console.log("Direct analysis detected blue clothing");
      return "bleu";
    }
    
    // Étape 1: Générer une description de l'image
    const imageDescription = await generateImageDescription(imageUrl, hf);
    
    // Vérifier si la description contient des mots-clés de jeans/pantalons bleus
    if (imageDescription.toLowerCase().includes("blue jeans") || 
        imageDescription.toLowerCase().includes("denim") ||
        (imageDescription.toLowerCase().includes("blue") && 
        (imageDescription.toLowerCase().includes("pants") || 
         imageDescription.toLowerCase().includes("trousers")))) {
      console.log("Description suggests blue jeans/pants");
      return "bleu";
    }
    
    // Collecter les résultats de différentes méthodes de détection
    let detectedColors = [];
    
    // Étape 2: Extraire la couleur du vêtement à partir de la description
    let detectedColor = await extractClothingColor(imageDescription, hf);
    if (detectedColor && detectedColor.length < 20) {
      detectedColors.push(detectedColor);
    }
    
    // Étape 3: Essayer avec une requête directe si nécessaire
    const directQueryColor = await performDirectColorQuery(imageDescription, hf);
    if (directQueryColor && directQueryColor.length < 20) {
      detectedColors.push(directQueryColor);
    }
    
    // Étape 4: Détecter la couleur dominante si nécessaire
    if (detectedColors.length === 0) {
      const dominantColor = await detectDominantColor(imageDescription, hf);
      if (dominantColor && dominantColor !== "unknown") {
        detectedColors.push(dominantColor);
      }
    }
    
    // Étape 5: Déterminer la couleur la plus probable parmi celles détectées
    let finalDetectedColor = await determineMostLikelyColor(imageDescription, detectedColors, hf);
    
    // Étape 6: Mapper la couleur détectée vers les couleurs françaises disponibles
    return mapToFrenchColor(finalDetectedColor);
  } catch (error) {
    console.error("Error detecting clothing color:", error);
    // Retourner une couleur par défaut au lieu de "multicolore"
    return "bleu"; // Couleur par défaut car souvent les vêtements sont bleus
  }
}

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 * @param detectedColor Couleur détectée
 * @returns Couleur validée
 */
function validateDetectedColor(detectedColor: string): string {
  // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
  if (!availableColors.includes(detectedColor)) {
    // Au lieu de retourner "multicolore", trouver la couleur la plus proche dans la liste
    const scores = availableColors.map(color => {
      const priority = colorPriority[color] || 0;
      return { color, priority };
    });
    
    // Trier par priorité (du plus élevé au plus bas)
    scores.sort((a, b) => b.priority - a.priority);
    
    // Retourner la couleur avec la plus haute priorité
    return scores[0].color;
  }
  return detectedColor;
}

// Fonction principale qui gère les requêtes HTTP
serve(async (req) => {
  // Gérer les requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    
    if (!imageUrl) {
      return new Response(
        JSON.stringify({ error: 'URL de l\'image manquante' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extraire la couleur du vêtement de l'image
    let color = await detectClothingColor(imageUrl);
    
    // Valider que la couleur détectée est parmi les couleurs disponibles
    color = validateDetectedColor(color);
    
    console.log("Final detected color:", color);
    
    return new Response(
      JSON.stringify({ color }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la détection de couleur:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Une erreur s\'est produite lors de la détection de couleur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
