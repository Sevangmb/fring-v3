
/**
 * User type definition
 */
export interface User {
  id: string;
  email: string;
  created_at?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
  };
}

/**
 * Response type for user operations
 */
export interface UserOperationResponse {
  success: boolean;
  error: Error | null;
}
