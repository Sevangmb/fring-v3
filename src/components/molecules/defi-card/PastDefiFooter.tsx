
import React from "react";
import { Text } from "@/components/atoms/Typography";
import { Award, Vote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVote } from "@/hooks/useVote";

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
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-4">
        <Text className="text-sm text-muted-foreground">
          <Award className="h-4 w-4 inline mr-1" />
          {participantsCount} participant{participantsCount > 1 ? 's' : ''}
        </Text>
        {votesCount > 0 && (
          <Text className="text-sm text-muted-foreground">
            <Vote className="h-4 w-4 inline mr-1" />
            {votesCount} vote{votesCount > 1 ? 's' : ''}
          </Text>
        )}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-sm opacity-70"
        disabled
      >
        Défi terminé
      </Button>
    </div>
  );
};

export default PastDefiFooter;
