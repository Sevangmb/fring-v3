
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const GOOGLE_AI_API_KEY = Deno.env.get('GOOGLE_AI_API_KEY');

// Headers CORS pour permettre les requêtes depuis le front-end
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Traitement de l'analyse d'étiquette
async function analyzeEtiquetteWithGoogleAI(imageBase64: string): Promise<Record<string, string>> {
  console.log("Analyzing clothing label with Google AI");
  
  // Extraction de la partie base64 pour l'API
  const base64Image = imageBase64.split(',')[1]; 
  
  // Prompt pour Google AI
  const prompt = `
    Tu es un expert en analyse d'étiquettes de vêtements. Analyse cette image d'étiquette de vêtement et extrait les informations suivantes:
    - Composition: matériaux qui composent le vêtement (coton, polyester, etc.)
    - Instructions de lavage: température de lavage, séchage, repassage, etc.
    - Pays de fabrication
    - Taille exacte selon l'étiquette
    - Marque si visible
    
    Présente uniquement ces informations sous forme de liste clé-valeur. Si une information n'est pas visible, indique "Non détecté".
  `;
  
  try {
    // Construction de la requête pour l'API Gemini
    const requestPayload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1000,
      }
    };
    
    // Envoi de la requête à l'API Google AI Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GOOGLE_AI_API_KEY}`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestPayload)
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Google AI API error ${response.status}:`, errorText);
      throw new Error(`Erreur API Google AI: ${response.status}`);
    }
    
    // Traitement de la réponse
    const result = await response.json();
    console.log("Received response from Google AI");
    
    if (!result.candidates || !result.candidates[0] || !result.candidates[0].content || !result.candidates[0].content.parts) {
      throw new Error("Structure de réponse Google AI invalide");
    }
    
    // Extraction du texte généré
    const textResponse = result.candidates[0].content.parts[0].text;
    
    // Conversion du texte en structure clé-valeur
    const resultObject: Record<string, string> = {};
    
    // Analyse simple ligne par ligne
    const lines = textResponse.split('\n');
    for (const line of lines) {
      const match = line.match(/^[-•\s]*(.+?):\s*(.+)$/);
      if (match) {
        const [_, key, value] = match;
        resultObject[key.trim()] = value.trim();
      }
    }
    
    return resultObject;
  } catch (error) {
    console.error("Error analyzing label:", error);
    throw new Error(`Erreur lors de l'analyse: ${error.message}`);
  }
}

serve(async (req) => {
  // Gestion des requêtes OPTIONS pour CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Vérification de la clé API
    if (!GOOGLE_AI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Clé API Google AI non configurée" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Récupération des données de la requête
    const { image, userId } = await req.json();
    
    if (!image) {
      return new Response(
        JSON.stringify({ error: "Aucune image fournie" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Analyse de l'étiquette
    const results = await analyzeEtiquetteWithGoogleAI(image);
    
    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error in analyze-etiquette function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
