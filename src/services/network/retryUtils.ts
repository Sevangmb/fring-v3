
/**
 * Retry a function with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param delay Initial delay in ms
 * @returns Result of the function
 */
export const fetchWithRetry = async <T>(
  fn: () => Promise<T>, 
  maxRetries = 3, 
  delay = 1000
): Promise<T> => {
  let retries = 0;
  let lastError: any;

  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries >= maxRetries) {
        break;
      }
      
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms...`);
      
      // Wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Exponential backoff
      delay *= 2;
    }
  }

  throw lastError;
};

/**
 * Check if the application has internet connection
 * @returns Promise<boolean> True if connected, false otherwise
 */
export const checkConnection = async (): Promise<boolean> => {
  // If navigator.onLine is false, we're definitely offline
  if (!navigator.onLine) {
    return false;
  }
  
  // Try to fetch a resource to confirm connectivity
  try {
    await fetch('/api/health-check', { 
      method: 'HEAD',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    return true;
  } catch (error) {
    console.error('Connection check failed:', error);
    return false;
  }
};
