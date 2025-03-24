
import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { fetchEnsembleById } from "@/services/ensemble";
import { useToast } from "@/hooks/use-toast";
import { DefiState } from "./types";

export const useDefiCard = (id: number, ensembleId?: number) => {
  const [validEnsembleId, setValidEnsembleId] = useState<number | undefined>(ensembleId);
  const [participation, setParticipation] = useState<any>(null);
  const [participantEnsembleId, setParticipantEnsembleId] = useState<number | null>(null);
  const [ensembleName, setEnsembleName] = useState<string | null>(null);
  const [votesCount, setVotesCount] = useState<number>(0);
  const [participantsCount, setParticipantsCount] = useState<number>(0);
  const [leaderName, setLeaderName] = useState<string | null>(null);
  const [userHasVoted, setUserHasVoted] = useState<boolean>(false);
  const { toast } = useToast();

  // Récupérer la participation de l'utilisateur actuel s'il y en a une
  const fetchUserParticipation = async () => {
    try {
      // Vérifier si l'utilisateur actuel a participé à ce défi
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      const { data, error } = await supabase
        .from('defi_participations')
        .select('id, ensemble_id')
        .eq('defi_id', id)
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (data && data.ensemble_id) {
        console.log(`Participation trouvée: ${JSON.stringify(data)}`);
        setParticipation(data);
        setParticipantEnsembleId(data.ensemble_id);
        setValidEnsembleId(data.ensemble_id);
        
        // Récupérer les détails de l'ensemble pour afficher son nom
        try {
          const ensemble = await fetchEnsembleById(data.ensemble_id);
          if (ensemble) {
            setEnsembleName(ensemble.nom);
          }
        } catch (ensembleError) {
          console.error("Erreur lors de la récupération des détails de l'ensemble:", ensembleError);
        }
      } else {
        console.log(`Aucune participation trouvée pour le défi ${id}`);
      }
    } catch (err) {
      console.error("Erreur lors de la vérification de la participation:", err);
    }
  };

  // Récupérer le nombre de votes et le leader pour ce défi
  const fetchVotesAndLeader = async () => {
    try {
      // Vérifier si l'utilisateur a déjà voté pour ce défi
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: voteData } = await supabase
          .from('defi_votes')
          .select('id')
          .eq('defi_id', id)
          .eq('user_id', session.user.id)
          .is('ensemble_id', null)
          .maybeSingle();
        
        setUserHasVoted(!!voteData);
      }
      
      // Récupérer le nombre total de votes pour ce défi
      const { data: votesData } = await supabase
        .from('defi_votes')
        .select('id')
        .eq('defi_id', id)
        .is('ensemble_id', null);
      
      setVotesCount(votesData?.length || 0);
      
      // Récupérer le nombre total de participants pour ce défi
      const { data: participationsData } = await supabase
        .from('defi_participations')
        .select('id')
        .eq('defi_id', id);
        
      setParticipantsCount(participationsData?.length || 0);
      
      // Récupérer le participant en tête (avec le plus de participations)
      const { data: participations } = await supabase
        .from('defi_participations')
        .select(`
          id,
          ensemble_id,
          user_id,
          tenue:ensemble_id(
            nom
          )
        `)
        .eq('defi_id', id)
        .order('created_at', { ascending: false });
      
      if (participations && participations.length > 0) {
        // Pour simplifier, on prend le participant le plus récent
        // Dans une version plus avancée, on pourrait compter les votes pour chaque participation
        const leader = participations[0];
        
        if (leader.tenue) {
          // Handle the case where tenue might be returned as an array
          if (Array.isArray(leader.tenue) && leader.tenue.length > 0) {
            const nomValue = leader.tenue[0].nom;
            if (typeof nomValue === 'string') {
              setLeaderName(nomValue);
            }
          } 
          // Handle the case where tenue is returned as an object
          else if (typeof leader.tenue === 'object' && leader.tenue !== null && 'nom' in leader.tenue) {
            const nomValue = leader.tenue.nom;
            if (typeof nomValue === 'string') {
              setLeaderName(nomValue);
            }
          }
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des votes:", error);
    }
  };

  return {
    state: {
      participation,
      participantEnsembleId,
      ensembleName,
      votesCount,
      leaderName,
      userHasVoted,
      validEnsembleId,
      participantsCount
    } as DefiState,
    fetchUserParticipation,
    fetchVotesAndLeader,
    setValidEnsembleId
  };
};
