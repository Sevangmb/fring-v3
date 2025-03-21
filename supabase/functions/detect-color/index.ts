
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
    const color = await detectDominantColor(imageUrl);
    
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
    // Nous utilisons le modèle de vision pour décrire l'image
    const hf = new HfInference(Deno.env.get('HUGGINGFACE_API_KEY'));
    
    const result = await hf.imageToText({
      model: "nlpconnect/vit-gpt2-image-captioning",
      data: imageToAnalyze,
    });

    console.log("Hugging Face API result:", result);
    
    // Extraire les termes de couleur à partir de la description générée
    const description = result.generated_text.toLowerCase();
    console.log("Generated description:", description);
    
    // Rechercher la couleur dans la description
    let detectedColor = 'multicolore';
    
    for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
      // Recherche simple du terme de couleur dans la description
      if (description.includes(englishColor)) {
        detectedColor = frenchColor;
        break;
      }
    }
    
    // Si aucune couleur n'est détectée dans la description, on fait une requête spécifique 
    // pour demander la couleur dominante
    if (detectedColor === 'multicolore') {
      try {
        const colorQuery = await hf.textGeneration({
          model: "gpt2",
          inputs: `What is the dominant color of this image described as: ${description}? Answer with just one color name.`,
          parameters: {
            max_new_tokens: 10,
            temperature: 0.1
          }
        });
        
        console.log("Color query result:", colorQuery);
        
        const generatedColor = colorQuery.generated_text.toLowerCase().trim();
        
        // Rechercher la couleur dans la réponse générée
        for (const [englishColor, frenchColor] of Object.entries(colorMapping)) {
          if (generatedColor.includes(englishColor)) {
            detectedColor = frenchColor;
            break;
          }
        }
      } catch (error) {
        console.error("Error querying for specific color:", error);
      }
    }
    
    // Vérifier si la couleur détectée est dans la liste des couleurs disponibles
    if (!availableColors.includes(detectedColor)) {
      detectedColor = 'multicolore';
    }
    
    console.log("Final detected color:", detectedColor);
    return detectedColor;
  } catch (error) {
    console.error('Erreur dans detectDominantColor:', error);
    return 'multicolore'; // Couleur par défaut en cas d'erreur
  }
}

/**
 * Convertit un Blob en Base64
 */
async function blobToBase64(blob: Blob): Promise<string> {
  const arrayBuffer = await blob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const base64 = btoa(String.fromCharCode(...uint8Array));
  return base64;
}

