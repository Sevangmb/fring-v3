
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
  'white': 'blanc',
  'black': 'noir',
  'gray': 'gris',
  'grey': 'gris',
  'blue': 'bleu',
  'navy': 'bleu',
  'navy blue': 'bleu',
  'light blue': 'bleu',
  'dark blue': 'bleu',
  'sky blue': 'bleu',
  'royal blue': 'bleu',
  'teal': 'bleu',
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
  'light grey': 'gris',
  'denim': 'bleu',
  'indigo': 'bleu',
  'turquoise': 'bleu',
  'aqua': 'bleu',
  'cyan': 'bleu'
};

// Liste des couleurs disponibles dans l'application
const availableColors = [
  'blanc', 'noir', 'gris', 'bleu', 'rouge', 'vert', 
  'jaune', 'orange', 'violet', 'rose', 'marron', 'beige', 'multicolore'
];

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
    // Créer un prompt spécifique pour extraire la couleur
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
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
      inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word.`,
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
 * Mappe la couleur détectée en anglais vers son équivalent français
 * @param detectedColor Couleur détectée en anglais
 * @returns Couleur en français
 */
function mapToFrenchColor(detectedColor: string): string {
  console.log("Mapping detected color to French:", detectedColor);
  
  for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
    if (detectedColor.includes(englishColor)) {
      console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
      return frenchColor;
    }
  }
  
  // Si aucune correspondance n'est trouvée
  console.log("No color mapping found for:", detectedColor);
  return "multicolore";
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
    
    // Étape 1: Générer une description de l'image
    const imageDescription = await generateImageDescription(imageUrl, hf);
    
    // Étape 2: Extraire la couleur du vêtement à partir de la description
    let detectedColor = await extractClothingColor(imageDescription, hf);
    
    // Si la détection échoue, essayer avec une requête directe
    if (!detectedColor || detectedColor.length > 20) {
      console.log("First detection failed, trying with direct query");
      detectedColor = await performDirectColorQuery(imageDescription, hf);
    }
    
    // Étape 3: Mapper la couleur détectée vers les couleurs françaises disponibles
    return mapToFrenchColor(detectedColor);
  } catch (error) {
    console.error("Error detecting clothing color:", error);
    return "multicolore"; // Valeur par défaut en cas d'erreur
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
    return 'multicolore';
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
