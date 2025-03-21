
// Export all vetement-related functions from a single entry point
export * from './types';
export * from './fetchVetements';
export * from './addVetement';
export * from './updateVetement';
export * from './deleteVetement';
export * from './demoVetements';

// Export default deleteVetement for backwards compatibility
import deleteVetement from './deleteVetement';
export default deleteVetement;
