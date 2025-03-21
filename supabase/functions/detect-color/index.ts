
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
      ? imageUrl.substring(0, imageUrl.indexOf(",") + 10) + "..." 
      : imageUrl.substring(0, 50) + "...";
    
    console.log("Processing image:", truncatedUrl);
    
    try {
      // Extraire les informations du vêtement de l'image (couleur et catégorie)
      const clothingInfo = await detectClothingInfo(imageUrl);
      
      console.log("Final detection results:");
      console.log("- Detected color:", clothingInfo.color);
      console.log("- Detected category:", clothingInfo.category);
      
      return new Response(
        JSON.stringify(clothingInfo),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (detectionError) {
      console.error('Erreur spécifique à la détection:', detectionError);
      
      // Générer des résultats aléatoires en cas d'erreur
      const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
      const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Jupe', 'Veste'];
      
      const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
      const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
      
      return new Response(
        JSON.stringify({ 
          error: detectionError.message || 'Une erreur s\'est produite lors de la détection', 
          color: randomColor,
          category: randomCategory
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Erreur lors de la détection:', error);
    
    // En cas d'erreur générale, retourner des résultats aléatoires
    const randomColors = ['bleu', 'rouge', 'vert', 'jaune', 'noir', 'blanc', 'violet', 'orange'];
    const randomCategories = ['T-shirt', 'Pantalon', 'Chemise', 'Robe', 'Jupe', 'Veste'];
    
    const randomColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    const randomCategory = randomCategories[Math.floor(Math.random() * randomCategories.length)];
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Une erreur s\'est produite lors de la détection', 
        color: randomColor,
        category: randomCategory
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
