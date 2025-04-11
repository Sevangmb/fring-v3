
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchDefiById } from "@/services/defi/votes/fetchDefiById";
import { getDefiParticipationsWithVotes } from "@/services/defi/votes/getDefiParticipationsWithVotes";

export const useDefiPage = (id: string | undefined) => {
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
  
  useEffect(() => {
    loadDefiData();
  }, [id]);
  
  return {
    defi,
    participations,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleBack,
    getDefiStatus,
    handleVoteUpdated,
    handleParticipationUpdated
  };
};
