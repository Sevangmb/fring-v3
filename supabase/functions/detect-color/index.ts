
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Correspondance entre les couleurs anglaises retournées par l'API et les couleurs françaises disponibles
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
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64;
}

/**
 * Fonction qui détecte la couleur dominante d'un vêtement en utilisant Hugging Face
 */
async function detectClothingColor(imageUrl: string): Promise<string> {
  try {
    console.log("Detecting clothing color from image:", imageUrl.substring(0, 50) + "...");
    
    // Vérifier si l'URL est un data URL ou une URL HTTP
    const isDataUrl = imageUrl.startsWith('data:');
    
    // Initialiser l'API Hugging Face
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    // Utiliser un modèle plus précis pour la détection des vêtements
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: imageUrl,
    });
    
    console.log("Image description:", visionResult);
    
    // Extraire une description précise de l'image
    const imageDescription = visionResult.generated_text;
    
    // Utiliser un modèle de langage pour extraire spécifiquement la couleur du vêtement
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
    Return ONLY the color name - nothing else, no explanations or additional text.
    `;
    
    const colorResult = await hf.textGeneration({
      model: "google/flan-t5-xxl", // Modèle de langage plus grand et plus précis
      inputs: colorAnalysisPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2, // Faible température pour des réponses plus déterministes
      }
    });
    
    console.log("Raw detected color:", colorResult.generated_text);
    
    // Nettoyer la réponse et extraire la couleur
    let detectedColor = colorResult.generated_text.toLowerCase().trim();
    
    // Si la détection échoue, essayer directement avec une requête spécifique
    if (!detectedColor || detectedColor.length > 20) {
      console.log("First detection failed, trying with direct query");
      
      // Utiliser une requête plus spécifique pour la couleur
      const directColorQuery = await hf.textGeneration({
        model: "google/flan-t5-xxl",
        inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word.`,
        parameters: {
          max_new_tokens: 10,
          temperature: 0.2,
        }
      });
      
      detectedColor = directColorQuery.generated_text.toLowerCase().trim();
      console.log("Direct query color result:", detectedColor);
    }
    
    // Mapper la couleur détectée vers les couleurs françaises disponibles
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (detectedColor.includes(englishColor)) {
        console.log(`Mapped '${detectedColor}' to '${frenchColor}'`);
        return frenchColor;
      }
    }
    
    // Si aucune correspondance n'est trouvée
    console.log("No color mapping found for:", detectedColor);
    return "multicolore";
  } catch (error) {
    console.error("Error detecting clothing color:", error);
    return "multicolore"; // Valeur par défaut en cas d'erreur
  }
}

/**
 * Valide la couleur détectée par rapport aux couleurs disponibles
 */
function validateDetectedColor(detectedColor: string): string {
  // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
  if (!availableColors.includes(detectedColor)) {
    return 'multicolore';
  }
  return detectedColor;
}

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
