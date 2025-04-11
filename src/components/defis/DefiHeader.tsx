
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, Users, Trophy, ThumbsUp, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoterDialog from "@/components/molecules/VoterDialog";

interface DefiHeaderProps {
  defi: any;
  defiStatus: string | null;
  onBack: () => void;
  onVoteUpdated: () => Promise<void>;
}

const DefiHeader: React.FC<DefiHeaderProps> = ({ defi, defiStatus, onBack, onVoteUpdated }) => {
  const formatDateRange = (startDate: string, endDate: string) => {
    return `Du ${format(new Date(startDate), 'dd MMMM yyyy', {
      locale: fr
    })} au ${format(new Date(endDate), 'dd MMMM yyyy', {
      locale: fr
    })}`;
  };

  return (
    <>
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>
      
      <div className="flex justify-between items-start flex-col md:flex-row gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{defi.titre}</h1>
            <div className="flex items-center ml-2 gap-2">
              <div className="flex items-center text-muted-foreground">
                <ThumbsUp className="mr-1 h-4 w-4" />
                <span>{defi.votes_count || 0}</span>
              </div>
              <VoterDialog 
                elementId={defi.id} 
                elementType="defi"
                onVoteUpdated={onVoteUpdated}
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {formatDateRange(defi.date_debut, defi.date_fin)}
            </div>
            <div className="flex items-center">
              <Users className="mr-1 h-4 w-4" />
              {defi.participants_count} participant{defi.participants_count !== 1 ? 's' : ''}
            </div>
            <div className="flex items-center">
              <Trophy className="mr-1 h-4 w-4" />
              {defiStatus === "current" 
                ? "En cours" 
                : defiStatus === "upcoming" 
                  ? "À venir" 
                  : "Terminé"
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefiHeader;
