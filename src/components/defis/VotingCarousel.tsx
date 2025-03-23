
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getDefiParticipationsWithVotes, submitVote, getUserVote } from "@/services/defi/voteService";
import { fetchDefiById } from "@/services/defi";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/atoms/Typography";
import EnsembleImages from "@/components/ensembles/EnsembleImages";
import { determineVetementTypeSync } from "@/components/ensembles/utils/vetementTypeUtils";
import { VetementType } from "@/services/meteo/tenue";

interface VotingCarouselProps {
  defiId: number;
}

const VotingCarousel: React.FC<VotingCarouselProps> = ({ defiId }) => {
  const { toast } = useToast();
  const [participations, setParticipations] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [votingState, setVotingState] = useState<Record<number, 'up' | 'down' | null>>({});
  const [defi, setDefi] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Charger le défi
        const defiData = await fetchDefiById(defiId);
        if (defiData) {
          setDefi(defiData);
        }
        
        // Charger les participations avec les votes
        const data = await getDefiParticipationsWithVotes(defiId);
        setParticipations(data);
        
        // Initialiser l'état des votes de l'utilisateur
        const userVotes: Record<number, 'up' | 'down' | null> = {};
        for (const participation of data) {
          const userVote = await getUserVote(defiId, participation.ensemble_id);
          userVotes[participation.ensemble_id] = userVote;
        }
        setVotingState(userVotes);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les participations du défi",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [defiId, toast]);

  const handleVote = async (ensembleId: number, vote: 'up' | 'down') => {
    try {
      const success = await submitVote(defiId, ensembleId, vote);
      
      if (success) {
        // Mettre à jour l'état local des votes
        setVotingState(prev => ({
          ...prev,
          [ensembleId]: vote
        }));
        
        // Mettre à jour les compteurs de votes
        setParticipations(prev => 
          prev.map(p => {
            if (p.ensemble_id === ensembleId) {
              const oldVote = votingState[ensembleId];
              const votes = { ...p.votes };
              
              // Si l'utilisateur change son vote
              if (oldVote) {
                if (oldVote === 'up') votes.up = Math.max(0, votes.up - 1);
                if (oldVote === 'down') votes.down = Math.max(0, votes.down - 1);
              }
              
              // Ajouter le nouveau vote
              if (vote === 'up') votes.up += 1;
              if (vote === 'down') votes.down += 1;
              
              // Recalculer le score
              const score = votes.up - votes.down;
              
              return { ...p, votes, score };
            }
            return p;
          })
        );
        
        toast({
          title: "Vote enregistré !",
          description: `Vous avez ${vote === 'up' ? 'aimé' : 'disliké'} cet ensemble.`,
          variant: vote === 'up' ? "default" : "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du vote:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre vote",
        variant: "destructive"
      });
    }
  };

  const navigatePrevious = () => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  };

  const navigateNext = () => {
    setCurrentIndex(prev => (prev < participations.length - 1 ? prev + 1 : prev));
  };

  // Organiser les vêtements par type
  const organizeVetementsByType = (ensemble: any) => {
    if (!ensemble || !ensemble.vetements) return {};
    
    const result: Record<string, any[]> = {
      [VetementType.HAUT]: [],
      [VetementType.BAS]: [],
      [VetementType.CHAUSSURES]: [],
      'autre': []
    };
    
    const orderedVetements = [...ensemble.vetements].sort(
      (a, b) => a.position_ordre - b.position_ordre
    );
    
    orderedVetements.forEach(item => {
      const type = determineVetementTypeSync(item.vetement);
      result[type].push(item.vetement);
    });
    
    return result;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Chargement des participations...</span>
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Aucune participation pour ce défi pour le moment.
        </p>
      </div>
    );
  }

  const currentEnsemble = participations[currentIndex]?.ensemble;
  const currentVotes = participations[currentIndex]?.votes || { up: 0, down: 0 };
  const currentScore = participations[currentIndex]?.score || 0;
  const totalVotes = currentVotes.up + currentVotes.down;
  const upPercentage = totalVotes ? (currentVotes.up / totalVotes) * 100 : 50;
  const currentEnsembleId = participations[currentIndex]?.ensemble_id;
  const userVote = votingState[currentEnsembleId];

  return (
    <div className="space-y-6">
      {defi && (
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">{defi.titre}</h2>
          <p className="text-muted-foreground">{defi.description}</p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={navigatePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {currentIndex + 1} / {participations.length}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={navigateNext}
            disabled={currentIndex === participations.length - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Score: {currentScore}</span>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>{currentEnsemble?.nom || "Ensemble sans nom"}</CardTitle>
        </CardHeader>
        
        <CardContent>
          {currentEnsemble && (
            <>
              <EnsembleImages 
                vetementsByType={organizeVetementsByType(currentEnsemble)} 
              />
              
              {currentEnsemble.description && (
                <p className="mt-4 text-sm text-muted-foreground">
                  {currentEnsemble.description}
                </p>
              )}
              
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span>👎 {currentVotes.down}</span>
                  <span>👍 {currentVotes.up}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-200 h-2 rounded-full" style={{ width: `${100 - upPercentage}%` }}></div>
                  <div className="bg-green-200 h-2 rounded-full" style={{ width: `${upPercentage}%` }}></div>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center gap-6 pt-4 border-t">
          <Button 
            onClick={() => handleVote(currentEnsembleId, 'down')}
            variant={userVote === 'down' ? 'default' : 'outline'} 
            size="lg"
            className={`flex flex-col items-center p-6 ${
              userVote === 'down' 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'hover:bg-red-50 hover:border-red-200'
            }`}
          >
            <ThumbsDown className={`h-8 w-8 mb-2 ${userVote === 'down' ? 'text-white' : 'text-red-500'}`} />
            <span>Je n'aime pas</span>
          </Button>
          
          <Button 
            onClick={() => handleVote(currentEnsembleId, 'up')}
            variant={userVote === 'up' ? 'default' : 'outline'} 
            size="lg"
            className={`flex flex-col items-center p-6 ${
              userVote === 'up' 
                ? 'bg-green-500 hover:bg-green-600 text-white' 
                : 'hover:bg-green-50 hover:border-green-200'
            }`}
          >
            <ThumbsUp className={`h-8 w-8 mb-2 ${userVote === 'up' ? 'text-white' : 'text-green-500'}`} />
            <span>J'aime</span>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Classement</h3>
        <div className="space-y-2">
          {participations
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((p, index) => (
              <div 
                key={p.id} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  index === 0 ? 'bg-amber-100 border border-amber-200' : 
                  index === 1 ? 'bg-gray-100 border border-gray-200' :
                  index === 2 ? 'bg-orange-50 border border-orange-100' :
                  'bg-white border'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{p.ensemble?.nom || `Ensemble #${p.ensemble_id}`}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {p.votes.up} 👍 | {p.votes.down} 👎
                  </span>
                  <span className="font-semibold">Score: {p.score}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VotingCarousel;
