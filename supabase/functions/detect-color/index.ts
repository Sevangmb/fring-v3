
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

    console.log("Processing image URL:", imageUrl.substring(0, 50) + "...");
    
    // Extraire les informations du vêtement de l'image (couleur et catégorie)
    const clothingInfo = await detectClothingInfo(imageUrl);
    
    console.log("Final detected color:", clothingInfo.color);
    console.log("Detected category:", clothingInfo.category);
    
    return new Response(
      JSON.stringify(clothingInfo),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur s\'est produite lors de la détection', 
        color: 'bleu',
        category: 'T-shirt'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
