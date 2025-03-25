
import React, { useState, useEffect } from "react";
import { Text } from "@/components/atoms/Typography";
import { Award, Vote, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVote } from "@/hooks/useVote";
import { getWinningEnsemble } from "@/services/votes/getWinningEnsemble";

interface PastDefiFooterProps {
  defiId: number;
  participantsCount: number;
  votesCount: number;
}

const PastDefiFooter: React.FC<PastDefiFooterProps> = ({ 
  defiId, 
  participantsCount, 
  votesCount 
}) => {
  const [winner, setWinner] = useState<any>(null);
  
  useEffect(() => {
    const loadWinner = async () => {
      try {
        const winnerData = await getWinningEnsemble(defiId);
        setWinner(winnerData);
      } catch (error) {
        console.error("Erreur lors du chargement du gagnant:", error);
      }
    };
    
    loadWinner();
  }, [defiId]);
  
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <Text className="text-sm text-muted-foreground">
          <Trophy className="h-4 w-4 inline mr-1" />
          {participantsCount} participant{participantsCount > 1 ? 's' : ''}
        </Text>
        {votesCount > 0 && (
          <Text className="text-sm text-muted-foreground">
            <Vote className="h-4 w-4 inline mr-1" />
            {votesCount} vote{votesCount > 1 ? 's' : ''}
          </Text>
        )}
        {winner && (
          <Text className="text-sm font-medium text-primary">
            <Award className="h-4 w-4 inline mr-1 text-yellow-500" />
            Vainqueur: {winner.ensembleName}
          </Text>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-sm"
        as="a"
        href={`/defis/resultats/${defiId}`}
      >
        Voir les résultats
      </Button>
    </div>
  );
};

export default PastDefiFooter;
