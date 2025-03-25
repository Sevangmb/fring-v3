
import { supabase } from "@/lib/supabase";

/**
 * Utility function to check if the application is connected to the internet
 * and can reach the Supabase backend
 */
export const checkConnection = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    // Attempt a minimal request to verify Supabase connectivity
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error connecting to Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking connection:", error);
    return false;
  }
};

/**
 * Utility for retrying failed API requests with exponential backoff
 */
export const fetchWithRetry = async (
  fetchFn: () => Promise<any>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<any> => {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check internet connectivity first
      if (!navigator.onLine) {
        throw new Error('No internet connection');
      }
      
      return await fetchFn();
    } catch (error) {
      console.log(`Attempt ${attempt + 1}/${maxRetries} failed:`, error);
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        // Wait before retrying with exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError;
};
