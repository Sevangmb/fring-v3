
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/atoms/Typography";
import { Award, Vote } from "lucide-react";

interface PastDefiFooterProps {
  participantsCount: number;
  votesCount: number;
  defiId: number;
}

const PastDefiFooter: React.FC<PastDefiFooterProps> = ({
  participantsCount,
  votesCount,
  defiId
}) => {
  return (
    <>
      <div className="flex items-center gap-2">
        <Text className="text-sm text-muted-foreground">
          <Award className="h-4 w-4 inline mr-1" />
          {participantsCount} participants
        </Text>
        {votesCount > 0 && (
          <Text className="text-sm text-muted-foreground ml-2">
            <Vote className="h-4 w-4 inline mr-1" />
            {votesCount} votes
          </Text>
        )}
      </div>
      <div className="ml-auto flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link to={`/defis/${defiId}/resultats`}>Voir les résultats</Link>
        </Button>
      </div>
    </>
  );
};

export default PastDefiFooter;
