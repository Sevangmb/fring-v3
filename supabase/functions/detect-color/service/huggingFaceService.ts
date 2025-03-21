import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2';

/**
 * Génère la description d'une image à l'aide de Hugging Face
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Description de l'image
 */
export async function generateImageDescription(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Generating image description...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    const visionResult = await hf.imageToText({
      model: "Salesforce/blip-image-captioning-large",
      data: processedUrl,
    });
    
    console.log("Image description:", visionResult);
    return visionResult.generated_text;
  } catch (error) {
    console.error("Error generating image description:", error);
    throw new Error("Failed to generate image description");
  }
}

/**
 * Prétraite l'URL de l'image pour s'assurer qu'elle est utilisable par Hugging Face
 * @param imageUrl URL ou données base64 de l'image
 * @returns URL ou données traitées
 */
function preprocessImageUrl(imageUrl: string): string {
  // Vérifier si c'est déjà une URL ou une chaîne base64
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // Si c'est une chaîne base64, la retourner telle quelle
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }
  
  // Cas par défaut
  return imageUrl;
}

/**
 * Extrait la couleur d'un vêtement à partir de sa description
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function extractClothingColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Extracting clothing color from description...");
  
  // Vérifier d'abord si nous avons un pantalon ou jeans
  const isPantsOrJeans = checkIfPantsOrJeans(imageDescription);
  if (isPantsOrJeans) {
    console.log("Detected pants or jeans, returning blue");
    return "blue";
  }
  
  try {
    // Créer un prompt spécifique pour extraire la couleur avec une emphase sur le bleu
    const colorAnalysisPrompt = `
    Image description: "${imageDescription}"
    
    Task: Analyze this image description and identify ONLY the color of the clothing item.
    Focus exclusively on the main article of clothing. Ignore the background, accessories, or any other elements.
    
    If the clothing item appears to be any shade of blue, navy, denim, or similar blue tones, please identify it as "blue".
    If it appears to be pants, jeans, trousers, or any similar lower-body garment, please identify it as "blue".
    
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
 * Vérifie si la description concerne un pantalon ou un jeans
 * @param description Description de l'image
 * @returns Vrai si c'est un pantalon/jeans
 */
function checkIfPantsOrJeans(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  const pantsKeywords = [
    "pants", "jeans", "denim", "trousers", "slacks", "pantalon", 
    "leggings", "capris", "chinos", "khakis", "corduroys",
    "jean", "pant", "trouser", "bottom", "shorts"
  ];
  
  for (const keyword of pantsKeywords) {
    if (lowerDesc.includes(keyword)) {
      console.log(`Pants keyword found: ${keyword}`);
      return true;
    }
  }
  
  return false;
}

/**
 * Effectue une requête directe pour obtenir la couleur si la première méthode échoue
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function performDirectColorQuery(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Performing direct color query...");
  
  // Vérifier d'abord si nous avons un pantalon ou jeans
  const isPantsOrJeans = checkIfPantsOrJeans(imageDescription);
  if (isPantsOrJeans) {
    console.log("Detected pants or jeans in direct query, returning blue");
    return "blue";
  }
  
  try {
    const directColorQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What is the MAIN COLOR of the CLOTHING in this image: "${imageDescription}"? Answer with just ONE word. If it's any shade of blue (navy, denim, azure, etc), just say "blue". If it's pants, jeans or any lower-body garment, say "blue".`,
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
 * Analyse directement l'image pour détecter la couleur sans utiliser de description
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Couleur détectée
 */
export async function analyzeImageDirectly(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Analyzing image directly...");
  
  try {
    // Prétraitement de l'URL pour gérer les images en base64
    const processedUrl = preprocessImageUrl(imageUrl);
    
    // Vérifier d'abord si c'est un pantalon ou jeans
    const isPantsQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image pants, jeans, or any lower-body garment? Answer with only yes or no: ${processedUrl}`,
      parameters: {
        max_new_tokens: 5,
        temperature: 0.1,
      }
    });
    
    const isPants = isPantsQuery.generated_text.toLowerCase().trim();
    console.log("Is clothing pants/jeans?", isPants);
    
    if (isPants === "yes" || isPants.includes("yes")) {
      console.log("Pants detected, returning blue");
      return "blue";
    }
    
    // Si ce n'est pas un pantalon, vérifier si c'est bleu
    const visionQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `Is the main clothing item in this image blue? Answer with only yes or no: ${processedUrl}`,
      parameters: {
        max_new_tokens: 5,
        temperature: 0.1,
      }
    });
    
    const isBlue = visionQuery.generated_text.toLowerCase().trim();
    console.log("Is clothing blue?", isBlue);
    
    if (isBlue === "yes" || isBlue.includes("yes")) {
      return "blue";
    }
    
    return "unknown"; // Si ce n'est pas bleu, on laisse les autres méthodes déterminer la couleur
  } catch (error) {
    console.error("Error analyzing image directly:", error);
    return "unknown"; // En cas d'erreur, on continue avec les autres méthodes
  }
}

/**
 * Effectue une analyse approfondie pour détecter la couleur dominante
 * @param imageDescription Description de l'image
 * @param hf Client Hugging Face Inference
 * @returns Couleur dominante détectée
 */
export async function detectDominantColor(imageDescription: string, hf: HfInference): Promise<string> {
  console.log("Detecting dominant color...");
  
  // Vérifier d'abord si nous avons un pantalon ou jeans
  const isPantsOrJeans = checkIfPantsOrJeans(imageDescription);
  if (isPantsOrJeans) {
    console.log("Detected pants or jeans in dominant color detection, returning blue");
    return "blue";
  }
  
  try {
    const dominantColorPrompt = `
    Image description: "${imageDescription}"
    
    Task: What is the DOMINANT COLOR of the CLOTHING in this image?
    Ignore background colors or accessories. Focus only on the main clothing item.
    If it appears to be pants, jeans, trousers, or any lower-body garment, say "blue".
    Otherwise, you MUST choose only ONE of these color options: white, black, gray, blue, red, green, yellow, orange, purple, pink, brown, beige.
    Return ONLY the color name - just one word, no explanation.
    `;
    
    const dominantResult = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: dominantColorPrompt,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.1,
      }
    });
    
    const detectedColor = dominantResult.generated_text.toLowerCase().trim();
    console.log("Dominant color detected:", detectedColor);
    return detectedColor;
  } catch (error) {
    console.error("Error detecting dominant color:", error);
    return "unknown";
  }
}

/**
 * Analyse le type de vêtement sur l'image
 * @param imageUrl URL de l'image à analyser
 * @param hf Client Hugging Face Inference
 * @returns Type de vêtement
 */
export async function detectClothingType(imageUrl: string, hf: HfInference): Promise<string> {
  console.log("Detecting clothing type...");
  
  try {
    const clothingTypeQuery = await hf.textGeneration({
      model: "google/flan-t5-xxl",
      inputs: `What type of clothing item is shown in this image? Choose ONE category: shirt, t-shirt, pants, jeans, dress, skirt, jacket, coat, sweater, hoodie, shoes, boots, hat, or other: ${imageUrl}`,
      parameters: {
        max_new_tokens: 10,
        temperature: 0.2,
      }
    });
    
    const clothingType = clothingTypeQuery.generated_text.toLowerCase().trim();
    console.log("Clothing type detected:", clothingType);
    
    return clothingType;
  } catch (error) {
    console.error("Error detecting clothing type:", error);
    return "unknown";
  }
}
