
import React, { useEffect } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import { Flag } from "lucide-react";
import { DefiCardProps, DefiType } from "./types";
import { useDefiCard } from "./useDefiCard";
import DefiCardHeader from "./DefiCardHeader";
import DefiCardContent from "./DefiCardContent";
import PastDefiFooter from "./PastDefiFooter";
import CurrentDefiFooter from "./CurrentDefiFooter";
import UpcomingDefiFooter from "./UpcomingDefiFooter";

const DefiCard: React.FC<DefiCardProps> = ({
  id,
  title,
  description,
  dateRange,
  type,
  icon = <Flag className="h-5 w-5" />,
  participantsCount = 0,
  onParticipation,
  ensembleId
}) => {
  const isPast = type === "past";
  const isUpcoming = type === "upcoming";
  const isCurrent = type === "current";
  
  const { 
    state, 
    fetchUserParticipation, 
    fetchVotesAndLeader 
  } = useDefiCard(id, ensembleId);

  // Fetch user participation if the defi is current
  useEffect(() => {
    if (isCurrent) {
      fetchUserParticipation();
    }
  }, [id, isCurrent]);

  // Fetch votes and leader information
  useEffect(() => {
    fetchVotesAndLeader();
  }, [id]);

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all duration-300 ${isPast ? "opacity-80" : ""}`}>
      <DefiCardHeader 
        title={title} 
        type={type} 
        icon={icon as React.ReactElement} 
      />
      
      <DefiCardContent 
        description={description}
        dateRange={dateRange}
        isCurrent={isCurrent}
        leaderName={state.leaderName}
      />
      
      <CardFooter className="border-t p-3 bg-muted/20">
        {isPast ? (
          <PastDefiFooter 
            participantsCount={participantsCount}
            votesCount={state.votesCount}
            defiId={id}
          />
        ) : isUpcoming ? (
          <UpcomingDefiFooter />
        ) : (
          <CurrentDefiFooter 
            defiId={id}
            defiTitle={title}
            participantsCount={participantsCount}
            votesCount={state.votesCount}
            state={state}
            onParticipation={onParticipation}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default DefiCard;
