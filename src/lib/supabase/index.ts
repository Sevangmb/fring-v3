
// Re-export all functions from the individual modules
export { supabase } from './client';
export { 
  checkTableExists,
  checkFunctionExists,
  checkSupabaseConnection
} from './connection';
export {
  getUserIdByEmail,
  assignAllClothesToUser
} from './users';
export {
  initializeDatabaseTables
} from './initialization';
