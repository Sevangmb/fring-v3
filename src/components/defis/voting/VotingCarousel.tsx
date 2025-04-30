
import React, { useState, useEffect } from 'react';
import { useVotingCarousel } from './hooks/useVotingCarousel';
import VoteButtons from './VoteButtons';
import VoteProgress from './VoteProgress';
import { Card } from '@/components/ui/card';
import VetementCardContainer from '@/components/molecules/VetementCard/VetementCardContainer';
import VetementCardImage from '@/components/molecules/VetementCard/VetementCardImage';
import VetementCardContent from '@/components/molecules/VetementCard/VetementCardContent';
import { VoteType } from '@/services/votes/types';
import { Loader2 } from 'lucide-react';

interface VotingCarouselProps {
  defiId: number;
}

const VotingCarousel: React.FC<VotingCarouselProps> = ({ defiId }) => {
  const {
    defi,
    participations,
    currentIndex,
    loading,
    votingState,
    isSubmitting,
    connectionError,
    handleVote,
    navigatePrevious,
    navigateNext,
    hasMoreToVote
  } = useVotingCarousel(defiId);

  const [showAnimation, setShowAnimation] = useState(false);

  // Current participation to display
  const currentParticipation = participations[currentIndex];

  // Handle vote with animation
  const handleVoteWithAnimation = async (vote: VoteType) => {
    if (!currentParticipation) return;
    
    setShowAnimation(true);
    await handleVote(currentParticipation.ensemble_id, vote);
    
    // After voting, wait briefly before navigating to the next ensemble
    setTimeout(() => {
      setShowAnimation(false);
      navigateNext();
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Chargement des tenues...</p>
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-lg">
        <p className="text-red-600 font-medium">Erreur de connexion. Vérifiez votre connexion internet et réessayez.</p>
      </div>
    );
  }

  if (!hasMoreToVote) {
    return (
      <div className="text-center p-8 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Bravo !</h2>
        <p className="text-lg">Vous avez voté pour toutes les tenues de ce défi.</p>
        <p className="mt-2">Revenez plus tard pour voir les résultats finaux.</p>
      </div>
    );
  }

  if (!currentParticipation || !currentParticipation.ensemble) {
    return (
      <div className="text-center p-6">
        <p>Aucune tenue disponible pour le vote.</p>
      </div>
    );
  }

  // Get ensemble data from the current participation
  const ensemble = currentParticipation.ensemble;
  
  // Get vetement info from the ensemble for displaying the image
  const mainVetement = ensemble.vetements && ensemble.vetements.length > 0
    ? ensemble.vetements[0].vetement
    : null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <VoteProgress 
        current={currentIndex + 1} 
        total={participations.length} 
        votedCount={participations.length - (hasMoreToVote ? participations.length : 0)}
      />
      
      <div 
        className={`transition-all duration-500 ${showAnimation ? 'opacity-0 transform translate-x-full' : 'opacity-100'}`}
      >
        <VetementCardContainer>
          <div className="relative aspect-square">
            <VetementCardImage 
              imageUrl={ensemble.image_url || (mainVetement && mainVetement.image_url)} 
              nom={ensemble.nom}
            />
          </div>
          
          <Card className="p-4">
            <h3 className="text-xl font-bold mb-2">{ensemble.nom}</h3>
            {ensemble.description && (
              <p className="text-gray-600 mb-4">{ensemble.description}</p>
            )}
            
            <div className="mt-6 flex justify-center gap-8">
              <VoteButtons
                userVote={votingState[ensemble.id]} 
                onVote={handleVoteWithAnimation}
                isLoading={isSubmitting}
                size="lg"
                showLabels={true}
                disabled={isSubmitting}
              />
            </div>
          </Card>
        </VetementCardContainer>
      </div>
    </div>
  );
};

export default VotingCarousel;
