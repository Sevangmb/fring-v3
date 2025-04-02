
// Re-export core vote functionality
export { submitVote } from './submitVote';
export { getUserVote } from './getUserVote';

// Export DefiParticipationWithVotes interface and function
export { 
  getDefiParticipationsWithVotes, 
  checkUserParticipation
} from './getDefiParticipationsWithVotes';
export type { ParticipationWithVotes } from './getDefiParticipationsWithVotes';

// Export fetchDefiById
export { fetchDefiById } from './fetchDefiById';

// Export vote types
export * from './types';

// Export utility functions
export { 
  organizeVetementsByType,
  displayWeatherType 
} from './utils';
