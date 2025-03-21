
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
  'red': 'rouge',
  'green': 'vert',
  'yellow': 'jaune',
  'orange': 'orange',
  'purple': 'violet',
  'pink': 'rose',
  'brown': 'marron',
  'beige': 'beige',
  'cream': 'beige',
  'tan': 'beige',
  'turquoise': 'bleu',
  'navy': 'bleu',
  'burgundy': 'rouge',
  'maroon': 'marron',
  'silver': 'gris',
  'gold': 'jaune',
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
 * Fonction qui détecte la couleur dominante d'une image en utilisant Hugging Face
 */
async function detectDominantColor(imageUrl: string): Promise<string> {
  try {
    // Vérifier si l'URL est un data URL ou une URL HTTP
    const isDataUrl = imageUrl.startsWith('data:');
    
    // Si c'est un data URL, on doit extraire l'image
    let imageToAnalyze = imageUrl;
    if (isDataUrl) {
      // Essayer de récupérer l'image à partir du data URL
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Si necessaire, convertir le blob en une forme utilisable pour l'API
      const base64Data = await blobToBase64(blob);
      imageToAnalyze = base64Data;
    }

    // Utiliser l'API Hugging Face pour la détection de couleur
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    // Première tentative : demande spécifique pour se concentrer sur le vêtement
    const detectedColor = await detectColorWithDirectQuery(hf, imageToAnalyze);
    
    // Si aucune couleur spécifique n'est détectée, essayer avec la détection secondaire
    if (detectedColor === 'multicolore') {
      const refinedColor = await detectColorWithSecondaryMethod(hf, imageToAnalyze);
      return refinedColor;
    }
    
    return detectedColor;
  } catch (error) {
    console.error('Erreur dans detectDominantColor:', error);
    return 'multicolore'; // Couleur par défaut en cas d'erreur
  }
}

/**
 * Détecte la couleur avec une requête directe
 */
async function detectColorWithDirectQuery(hf: HfInference, imageToAnalyze: string): Promise<string> {
  try {
    // Demande spécifique pour se concentrer sur le vêtement
    const result = await hf.textGeneration({
      model: "gpt2",
      inputs: "Describe the color of the clothing item in this image, focus ONLY on the main clothing item and NOT the background. Respond with ONLY the color name:",
      parameters: {
        max_new_tokens: 20,
        temperature: 0.1
      }
    });
    
    console.log("Color query result:", result);
    
    const generatedColor = result.generated_text.toLowerCase().trim();
    console.log("Generated color text:", generatedColor);
    
    // Rechercher la couleur dans la réponse générée
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (generatedColor.includes(englishColor)) {
        return frenchColor;
      }
    }
    
    return 'multicolore';
  } catch (error) {
    console.error("Error in primary color detection:", error);
    return 'multicolore';
  }
}

/**
 * Détecte la couleur avec une méthode secondaire
 */
async function detectColorWithSecondaryMethod(hf: HfInference, imageToAnalyze: string): Promise<string> {
  try {
    // Générer une description de l'image
    const captionResult = await hf.imageToText({
      model: "nlpconnect/vit-gpt2-image-captioning",
      data: imageToAnalyze,
    });
    
    console.log("Image caption result:", captionResult);
    
    // Extraire les termes de couleur à partir de la description générée
    const description = captionResult.generated_text.toLowerCase();
    console.log("Generated description:", description);
    
    // Créer une requête plus spécifique basée sur la description
    const colorQuery = await hf.textGeneration({
      model: "gpt2",
      inputs: `The image shows: "${description}". What is the main color of the clothing item in this image? Answer with just one color name.`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1
      }
    });
    
    console.log("Refined color query result:", colorQuery);
    
    const refinedColor = colorQuery.generated_text.toLowerCase().trim();
    
    // Rechercher la couleur dans la réponse raffinée
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      if (refinedColor.includes(englishColor)) {
        return frenchColor;
      }
    }
    
    // Si aucune couleur n'a été trouvée, retourner la valeur par défaut
    return 'multicolore';
  } catch (error) {
    console.error("Error in secondary color detection:", error);
    return 'multicolore';
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

    // Extraire la couleur dominante de l'image en utilisant Hugging Face
    let color = await detectDominantColor(imageUrl);
    
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
