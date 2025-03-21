
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { detectClothingInfo } from "./service/colorDetection/index.ts";

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

    // Vérifier si l'image est au format base64
    const isBase64 = imageUrl.startsWith('data:');
    console.log("Image format:", isBase64 ? "base64" : "URL");
    
    // Ne pas logger toute l'URL/base64 pour éviter de surcharger les logs
    const truncatedUrl = isBase64 
      ? imageUrl.substring(0, Math.min(100, imageUrl.indexOf(",") + 10)) + "..." 
      : imageUrl.substring(0, 50) + "...";
    
    console.log("Processing image with Google AI Gemini:", truncatedUrl);
    
    try {
      // Extraire les informations du vêtement de l'image (couleur, catégorie et description)
      const clothingInfo = await detectClothingInfo(imageUrl);
      
      console.log("Google AI Gemini detection results:", clothingInfo);
      
      return new Response(
        JSON.stringify(clothingInfo),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (detectionError) {
      console.error('Erreur spécifique à la détection avec Google AI Gemini:', detectionError);
      
      // Retourner une erreur avec un message clair
      return new Response(
        JSON.stringify({ 
          error: detectionError.message || 'Une erreur s\'est produite lors de la détection',
          color: null,
          category: null,
          description: null
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erreur générale:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur s\'est produite', 
        color: null,
        category: null,
        description: null
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
