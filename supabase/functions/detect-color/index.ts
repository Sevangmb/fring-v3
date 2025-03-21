
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
    console.log("Processing image:", imageUrl.substring(0, 50) + "...");
    
    try {
      // Extraire les informations du vêtement de l'image (couleur et catégorie)
      const clothingInfo = await detectClothingInfo(imageUrl);
      
      console.log("Final detected color:", clothingInfo.color);
      console.log("Detected category:", clothingInfo.category);
      
      return new Response(
        JSON.stringify(clothingInfo),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (detectionError) {
      console.error('Erreur spécifique à la détection:', detectionError);
      
      // Générer une couleur aléatoire si la détection échoue
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      
      return new Response(
        JSON.stringify({ 
          error: detectionError.message || 'Une erreur s\'est produite lors de la détection', 
          color: randomColor,
          category: 'T-shirt'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    
    // En cas d'erreur générale, retourner une couleur aléatoire
    const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur s\'est produite lors de la détection', 
        color: randomColor,
        category: 'T-shirt'
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
