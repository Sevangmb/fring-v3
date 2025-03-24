
import React from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import EnsembleDetail from "./EnsembleDetail";
import VoteButtons from "./VoteButtons";
import { VoteType } from "@/services/votes/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VoteCarouselProps {
  ensembles: any[];
  userVotes: Record<number, VoteType>;
  isLoading: boolean;
  onVote: (ensembleId: number, vote: VoteType) => void;
  isOffline?: boolean;
}

const VoteCarousel: React.FC<VoteCarouselProps> = ({
  ensembles,
  userVotes,
  isLoading,
  onVote,
  isOffline = false
}) => {
  if (!ensembles || ensembles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Aucun ensemble à afficher</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Il n'y a pas encore de participations pour ce défi.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {ensembles.map((ensemble) => (
          <CarouselItem key={ensemble.id}>
            <div className="p-1">
              <Card>
                <CardHeader>
                  <CardTitle>{ensemble.nom || "Ensemble sans nom"}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <div className="mb-6 w-full">
                    <EnsembleDetail ensemble={ensemble} />
                  </div>
                  
                  <VoteButtons
                    userVote={userVotes[ensemble.id] || null}
                    onVote={(vote) => onVote(ensemble.id, vote)}
                    size="lg"
                    showLabels={true}
                    isLoading={isLoading}
                    disabled={isOffline}
                    connectionError={isOffline}
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-0" />
      <CarouselNext className="right-0" />
    </Carousel>
  );
};

export default VoteCarousel;
