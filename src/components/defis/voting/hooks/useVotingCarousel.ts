
import { useDefiData } from "./useDefiData";
import { useDefiVoting } from "./useDefiVoting";
import { useCarouselNavigation } from "./useCarouselNavigation";

export const useVotingCarousel = (defiId: number) => {
  // Get defi data and participations
  const {
    defi,
    participations,
    votingState,
    loading,
    connectionError,
    setParticipations,
    setVotingState
  } = useDefiData(defiId);

  // Setup carousel navigation
  const {
    currentIndex,
    navigatePrevious,
    navigateNext
  } = useCarouselNavigation(participations.length);

  // Setup voting functionality
  const {
    isSubmitting,
    handleVote
  } = useDefiVoting({
    defiId,
    participations,
    votingState,
    setParticipations,
    setVotingState
  });

  return {
    defi,
    participations,
    currentIndex,
    loading,
    votingState,
    isSubmitting,
    connectionError,
    handleVote,
    navigatePrevious,
    navigateNext
  };
};
