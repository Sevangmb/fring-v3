
// Ce fichier est conservé uniquement pour rétrocompatibilité
// et redirige vers les nouveaux modules

import {
  checkTableExists,
  checkFunctionExists,
  checkSupabaseConnection,
} from './database/connection';

import {
  getUserIdByEmail,
  assignAllClothesToUser,
  assignVetementsToUser,
} from './database/userOperations';

import {
  createTable,
} from './database/tableOperations';

import {
  initializeDatabase,
} from './database/initialization';

// Exporter toutes les fonctions pour maintenir la compatibilité
export {
  checkTableExists,
  checkFunctionExists,
  checkSupabaseConnection,
  getUserIdByEmail,
  assignAllClothesToUser,
  assignVetementsToUser,
  createTable,
  initializeDatabase,
};
