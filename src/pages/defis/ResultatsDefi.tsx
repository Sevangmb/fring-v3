
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Text } from "@/components/atoms/Typography";
import VotingCarousel from "@/components/defis/VotingCarousel";
import RankingList from "@/components/defis/voting/RankingList";
import Layout from "@/components/templates/Layout";
import PageHeader from "@/components/organisms/PageHeader";
import { Trophy, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDefiParticipationsWithVotes } from "@/services/defi/votes";

const ResultatsDefi: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const defiId = parseInt(id || "0", 10);
  const [defi, setDefi] = useState<any>(null);
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDefiData = async () => {
      if (!defiId || isNaN(defiId)) {
        setError("ID du défi invalide");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Charger les détails du défi
        const { supabase } = await import('@/lib/supabase');
        const { data: defiData, error: defiError } = await supabase
          .from('defis')
          .select('*')
          .eq('id', defiId)
          .single();
        
        if (defiError) throw defiError;
        setDefi(defiData);
        
        // Charger les participations avec votes
        const participationsData = await getDefiParticipationsWithVotes(defiId);
        setParticipations(participationsData);
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Impossible de charger les données du défi");
      } finally {
        setLoading(false);
      }
    };
    
    loadDefiData();
  }, [defiId]);

  return (
    <Layout>
      <PageHeader 
        title="Résultats du défi" 
        description={defi?.titre || "Découvrez les résultats et classements"} 
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            <CardTitle>{defi?.titre || "Résultats"}</CardTitle>
          </CardHeader>
          
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 text-center">
                <Text className="text-destructive">{error}</Text>
              </div>
            ) : participations.length === 0 ? (
              <div className="p-8 text-center">
                <Text className="text-muted-foreground">
                  Aucune participation n'a été trouvée pour ce défi.
                </Text>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Les gagnants du défi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {participations.slice(0, 3).map((participation, index) => (
                      <div key={participation.id} className={`rounded-lg border p-4 ${
                        index === 0 ? 'bg-amber-50 border-amber-200' : 
                        index === 1 ? 'bg-gray-50 border-gray-200' : 
                        'bg-orange-50 border-orange-100'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {index === 0 ? (
                            <Trophy className="h-5 w-5 text-amber-500" />
                          ) : index === 1 ? (
                            <Trophy className="h-5 w-5 text-gray-500" />
                          ) : (
                            <Trophy className="h-5 w-5 text-orange-500" />
                          )}
                          <span className="font-bold">#{index + 1}</span>
                        </div>
                        <h4 className="font-medium">{participation.ensemble?.nom || `Ensemble #${participation.ensemble_id}`}</h4>
                        <div className="flex justify-between items-center mt-2 text-sm">
                          <span>{participation.votes.up} 👍 | {participation.votes.down} 👎</span>
                          <span className="font-semibold">Score: {participation.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <RankingList participations={participations} />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Toutes les participations</h3>
                  <VotingCarousel defiId={defiId} />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ResultatsDefi;
