
/**
 * This file re-exports the refactored logs service for backward compatibility
 */

// Re-export all from the new modular structure
export * from './logs';

// For future imports, use the modular structure instead:
// import { logMessage, fetchLogs, etc. } from '@/services/logs';
