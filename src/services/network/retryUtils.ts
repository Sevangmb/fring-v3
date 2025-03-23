
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

/**
 * Utility function to check if the application is connected to the internet
 * and can reach the Supabase backend
 */
export const checkConnection = async (): Promise<boolean> => {
  if (!navigator.onLine) {
    return false;
  }
  
  try {
    // Check if we can connect to Supabase
    const response = await fetch('https://api.supabase.com/health', { 
      method: 'HEAD',
      // Using a short timeout to quickly determine connectivity
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.error("Error checking connection:", error);
    return false;
  }
};
