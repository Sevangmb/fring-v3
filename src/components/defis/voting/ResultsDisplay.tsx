import React, { useState, useEffect } from 'react';
import { getWinningEnsemble } from '@/services/defi/votes/getWinningEnsemble';
import { getDefiParticipationsWithVotes } from '@/services/defi/votes/getDefiParticipationsWithVotes';
import VetementCardContainer from '@/components/molecules/VetementCard/VetementCardContainer';
import VetementCardImage from '@/components/molecules/VetementCard/VetementCardImage';
import { Card } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, Award, Medal, Trophy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export interface ResultsDisplayProps {
  defiId: number;
  winner?: any; // Added this property
  votingResults?: { [key: number]: { id: number; name: string; upVotes: number; totalVotes: number; } }; // Added this property
  onClose?: () => void; // Added this property
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  defiId, 
  winner: initialWinner, 
  votingResults, 
  onClose 
}) => {
  const [loading, setLoading] = useState(!initialWinner);
  const [winner, setWinner] = useState<any>(initialWinner || null);
  const [topParticipants, setTopParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch results if not provided
    const fetchResults = async () => {
      if (initialWinner) {
        setWinner(initialWinner);
        return;
      }
      
      try {
        setLoading(true);
        
        // Récupérer toutes les participations avec leurs votes
        const allParticipations = await getDefiParticipationsWithVotes(defiId);
        
        // Trier par score (upvotes - downvotes)
        const sortedParticipations = [...allParticipations].sort((a, b) => {
          const scoreA = a.votes?.up - a.votes?.down || 0;
          const scoreB = b.votes?.up - b.votes?.down || 0;
          return scoreB - scoreA;
        });
        
        // Récupérer le gagnant (au cas où il y a plusieurs gagnants)
        const winnerData = await getWinningEnsemble(defiId);
        
        // Prendre les 3 premiers pour le podium
        setTopParticipants(sortedParticipations.slice(0, 3));
        setWinner(winnerData);
      } catch (error) {
        console.error("Erreur lors de la récupération des résultats:", error);
        setError("Une erreur est survenue lors du chargement des résultats.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [defiId, initialWinner]);
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-6 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }
  
  if (!winner && (!topParticipants || topParticipants.length === 0)) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center">
        <p className="text-yellow-600 font-medium">Aucun vote n'a encore été enregistré pour ce défi.</p>
      </div>
    );
  }
  
  // Les médailles pour le podium
  const medals = [
    { icon: <Trophy className="h-8 w-8 text-yellow-400" />, label: "1er", color: "bg-yellow-100" },
    { icon: <Medal className="h-8 w-8 text-gray-400" />, label: "2ème", color: "bg-gray-100" },
    { icon: <Award className="h-8 w-8 text-amber-700" />, label: "3ème", color: "bg-amber-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Résultats du défi</h2>
        <p className="text-gray-600">Félicitations à tous les participants !</p>
      </div>
      
      {/* Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {topParticipants.map((participant, index) => {
          const ensemble = participant.ensemble;
          const mainVetement = ensemble?.vetements && ensemble.vetements.length > 0
            ? ensemble.vetements[0].vetement
            : null;
            
          const score = participant.votes?.up - participant.votes?.down || 0;
          const totalVotes = (participant.votes?.up || 0) + (participant.votes?.down || 0);
          
          return (
            <div 
              key={ensemble?.id || index} 
              className={`${medals[index]?.color || 'bg-white'} p-4 rounded-lg shadow transition-all hover:shadow-lg relative overflow-hidden`}
            >
              {medals[index] && (
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  {medals[index].icon}
                  <span className="font-bold">{medals[index].label}</span>
                </div>
              )}
              
              <VetementCardContainer>
                <div className="relative aspect-square mb-4">
                  <VetementCardImage 
                    imageUrl={ensemble?.image_url || (mainVetement && mainVetement.image_url)} 
                    nom={ensemble?.nom || "Tenue"}
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-2">{ensemble?.nom || "Sans nom"}</h3>
                  {ensemble?.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">{ensemble.description}</p>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="h-4 w-4 text-green-600" />
                      <span>{participant.votes?.up || 0}</span>
                    </div>
                    <div className="text-lg font-bold">
                      {score > 0 ? `+${score}` : score}
                    </div>
                    <div className="flex items-center gap-2">
                      <ThumbsDown className="h-4 w-4 text-red-600" />
                      <span>{participant.votes?.down || 0}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-center text-sm text-gray-600">
                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''} au total
                  </div>
                </div>
              </VetementCardContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsDisplay;
