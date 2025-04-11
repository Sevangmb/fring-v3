import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "@/components/templates/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchDefiById } from "@/services/defi/votes/fetchDefiById";
import { getDefiParticipationsWithVotes } from "@/services/defi/votes/getDefiParticipationsWithVotes";
import { Loader2, ArrowLeft, Calendar, Users, Trophy, ThumbsUp } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import VoterDialog from "@/components/molecules/VoterDialog";
import { Text } from "@/components/atoms/Typography";
import DefiParticipationForm from "@/components/organisms/DefiParticipationForm";
import DefiParticipationsList from "@/components/organisms/DefiParticipationsList";

const DefiPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [defi, setDefi] = useState<any>(null);
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  
  const loadDefiData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const defiData = await fetchDefiById(Number(id));
      
      if (!defiData) {
        setError("Défi non trouvé");
        return;
      }
      
      setDefi(defiData);
      
      // Charger les participations
      const participationsData = await getDefiParticipationsWithVotes(Number(id));
      setParticipations(participationsData);
    } catch (error) {
      console.error("Erreur lors du chargement du défi:", error);
      setError("Une erreur est survenue lors du chargement du défi");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadDefiData();
  }, [id]);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const getDefiStatus = () => {
    if (!defi) return null;
    
    const now = new Date();
    const startDate = new Date(defi.date_debut);
    const endDate = new Date(defi.date_fin);
    
    if (endDate < now) return "past";
    if (startDate > now) return "upcoming";
    return "current";
  };
  
  const handleVoteUpdated = async () => {
    // Recharger le défi pour mettre à jour le nombre de votes
    await loadDefiData();
  };
  
  const handleParticipationUpdated = async () => {
    if (!id) return;
    
    try {
      // Recharger les participations
      const participationsData = await getDefiParticipationsWithVotes(Number(id));
      setParticipations(participationsData);
    } catch (error) {
      console.error("Erreur lors du rechargement des participations:", error);
    }
  };
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Chargement du défi...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (error || !defi) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Défi non trouvé</h1>
          <p className="text-muted-foreground mb-6">{error || "Ce défi n'existe pas ou a été supprimé"}</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const defiStatus = getDefiStatus();
  const formatDateRange = (startDate: string, endDate: string) => {
    return `Du ${format(new Date(startDate), 'dd MMMM yyyy', {
      locale: fr
    })} au ${format(new Date(endDate), 'dd MMMM yyyy', {
      locale: fr
    })}`;
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
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
                  onVoteUpdated={handleVoteUpdated}
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-8">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="participations">Participations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>À propos de ce défi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Description</h3>
                    <Text className="whitespace-pre-line">{defi.description}</Text>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Comment participer</h3>
                    <Text>
                      Pour participer à ce défi, choisissez un de vos ensembles ou créez-en un nouveau.
                      Vous pouvez modifier votre participation à tout moment avant la fin du défi.
                    </Text>
                  </div>
                  
                  {defiStatus === "current" && (
                    <DefiParticipationForm 
                      defiId={defi.id} 
                      onParticipationUpdated={handleParticipationUpdated}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="participations" className="space-y-6">
            <DefiParticipationsList 
              participations={participations} 
              defiStatus={defiStatus} 
              defiId={defi.id}
              onVoteUpdated={handleParticipationUpdated}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default DefiPage;