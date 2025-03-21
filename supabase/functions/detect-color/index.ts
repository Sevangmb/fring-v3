
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "./utils/cors.ts";
import { detectClothingColor } from "./service/colorDetection.ts";
import { validateDetectedColor } from "./utils/colorValidator.ts";

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
