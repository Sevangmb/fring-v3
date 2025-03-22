
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  fetchVetementsStats,
  fetchTenutesCount,
  fetchAmisCount,
  calculateDistributions,
  prepareRecentActivity,
  createEmptyDashboardStats,
  DashboardStats,
  VetementWithCategories
} from "@/utils/statsUtils";

export const useDashboardStats = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>(createEmptyDashboardStats());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Début de récupération des statistiques pour l'utilisateur:", user.id);

      // Récupérer toutes les données nécessaires
      const vetements = await fetchVetementsStats(user.id);
      const totalTenues = await fetchTenutesCount(user.id);
      const totalAmis = await fetchAmisCount(user.id);

      // Calculer les distributions
      const { 
        categoriesDistribution, 
        couleursDistribution, 
        marquesDistribution 
      } = calculateDistributions(vetements);

      // Préparer l'activité récente
      const recentActivity = prepareRecentActivity(vetements);

      // Mettre à jour l'état avec toutes les données récupérées
      setStats({
        totalVetements: vetements.length,
        totalTenues,
        totalAmis,
        categoriesDistribution,
        couleursDistribution,
        marquesDistribution,
        recentActivity
      });

      console.log("Statistiques du tableau de bord mises à jour avec succès");
    } catch (error: any) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setError(error.message || "Une erreur est survenue lors de la récupération des statistiques");
      
      // Afficher un toast d'erreur
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques du tableau de bord",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  return { stats, isLoading, error, refetch: fetchDashboardStats };
};
