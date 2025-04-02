
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shirt, Users, Loader2 } from "lucide-react";
import { Text } from "@/components/atoms/Typography";
import EnsembleCard from "@/components/ensembles/EnsembleCard";

interface DefiParticipationsListProps {
  participations: any[];
  defiStatus: string;
  defiId: number;
}

const DefiParticipationsList: React.FC<DefiParticipationsListProps> = ({
  participations,
  defiStatus,
  defiId
}) => {
  const [selectedTab, setSelectedTab] = React.useState("all");
  
  if (!participations || participations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 flex flex-col items-center justify-center py-10">
          <Shirt size={48} className="text-muted-foreground mb-2" />
          <Text className="text-center">
            Aucune participation pour ce défi pour le moment.
          </Text>
        </CardContent>
      </Card>
    );
  }
  
  // Trouver l'ensemble avec le plus de votes positifs
  let topParticipation = participations[0];
  let topScore = participations[0]?.votes.votesCount.up - participations[0]?.votes.votesCount.down;
  
  participations.forEach(p => {
    const score = p.votes.votesCount.up - p.votes.votesCount.down;
    if (score > topScore) {
      topScore = score;
      topParticipation = p;
    }
  });
  
  // Formatter les ensembles pour le composant EnsembleCard
  const formatEnsemble = (participation: any) => {
    return {
      id: participation.tenue.id,
      nom: participation.tenue.nom,
      description: participation.tenue.description,
      occasion: participation.tenue.occasion,
      saison: participation.tenue.saison,
      created_at: participation.tenue.created_at,
      user_id: participation.tenue.user_id,
      vetements: participation.tenue.vetements,
      email: participation.user_email
    };
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Participations ({participations.length})</CardTitle>
            <Badge className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {participations.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="top">Les mieux notées</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participations.map((participation) => (
                  <div key={participation.id} className="relative">
                    <EnsembleCard ensemble={formatEnsemble(participation)} />
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <Badge variant="secondary">
                        👍 {participation.votes.votesCount.up}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="top">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {participations
                  .sort((a, b) => {
                    const scoreA = a.votes.votesCount.up - a.votes.votesCount.down;
                    const scoreB = b.votes.votesCount.up - b.votes.votesCount.down;
                    return scoreB - scoreA;
                  })
                  .map((participation) => (
                    <div key={participation.id} className="relative">
                      <EnsembleCard ensemble={formatEnsemble(participation)} />
                      <div className="absolute top-2 right-2 flex items-center gap-1">
                        <Badge variant="secondary">
                          👍 {participation.votes.votesCount.up}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {defiStatus === "past" && topParticipation && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🏆</span> Ensemble gagnant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-md mx-auto">
              <EnsembleCard ensemble={formatEnsemble(topParticipation)} />
              <div className="mt-4 text-center">
                <Badge className="mb-2" variant="secondary">
                  Score: {topParticipation.votes.votesCount.up - topParticipation.votes.votesCount.down}
                </Badge>
                <Text>
                  Félicitations à {topParticipation.user_email.split('@')[0]} pour son ensemble "{topParticipation.tenue.nom}" !
                </Text>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DefiParticipationsList;
