
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetementService";
import { fetchVetementsStats } from "@/utils/statsUtils";
import { fetchTenutesCount } from "@/utils/statsUtils";
import { fetchAmisCount } from "@/utils/statsUtils";
import { calculateDistributions } from "@/utils/statsUtils";
import { prepareRecentActivity } from "@/utils/statsUtils";

interface DashboardStats {
  totalVetements: number;
  totalTenues: number;
  totalAmis: number;
  categoriesDistribution: { name: string; count: number }[];
  couleursDistribution: { name: string; count: number }[];
  marquesDistribution: { name: string; count: number }[];
  recentActivity: {
    type: string;
    date: string;
    description: string;
  }[];
}

export const useDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalVetements: 0,
    totalTenues: 0,
    totalAmis: 0,
    categoriesDistribution: [],
    couleursDistribution: [],
    marquesDistribution: [],
    recentActivity: []
  });
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

      // Fetch all required data
      const vetements = await fetchVetementsStats(user.id);
      const totalTenues = await fetchTenutesCount();
      const totalAmis = await fetchAmisCount(user.id);
      
      // Calculate distributions
      const { 
        categoriesDistribution, 
        couleursDistribution, 
        marquesDistribution 
      } = calculateDistributions(vetements);
      
      // Prepare recent activity
      const recentActivity = prepareRecentActivity(vetements);

      // Update state with all fetched data
      setStats({
        totalVetements: vetements.length || 0,
        totalTenues,
        totalAmis,
        categoriesDistribution,
        couleursDistribution,
        marquesDistribution,
        recentActivity
      });
    } catch (error: any) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      setError(error.message || "Une erreur est survenue lors de la récupération des statistiques");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [user]);

  return { stats, isLoading, error, refetch: fetchDashboardStats };
};
