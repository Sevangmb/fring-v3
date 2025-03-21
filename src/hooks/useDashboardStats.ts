
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetementService";
import { Ami } from "@/services/amis/types";

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

      // Récupérer les statistiques de vêtements
      const { data: vetements, error: vetementsError } = await supabase
        .from('vetements')
        .select('*')
        .eq('user_id', user.id);

      if (vetementsError) throw vetementsError;

      // Récupérer le nombre de tenues
      const { count: totalTenues, error: tenuesError } = await supabase
        .from('tenues')
        .select('*', { count: 'exact', head: true });

      if (tenuesError) throw tenuesError;

      // Récupérer le nombre d'amis
      const { data: amis, error: amisError } = await supabase
        .from('amis')
        .select('*')
        .or(`user_id.eq.${user.id},ami_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (amisError) throw amisError;

      // Calculer les distributions
      const categories: Record<string, number> = {};
      const couleurs: Record<string, number> = {};
      const marques: Record<string, number> = {};

      vetements?.forEach((vetement: Vetement) => {
        // Catégories
        if (vetement.categorie) {
          categories[vetement.categorie] = (categories[vetement.categorie] || 0) + 1;
        }

        // Couleurs
        if (vetement.couleur) {
          couleurs[vetement.couleur] = (couleurs[vetement.couleur] || 0) + 1;
        }

        // Marques
        if (vetement.marque) {
          marques[vetement.marque] = (marques[vetement.marque] || 0) + 1;
        }
      });

      // Transformer en tableaux pour les graphiques
      const categoriesDistribution = Object.entries(categories).map(([name, count]) => ({ name, count }));
      const couleursDistribution = Object.entries(couleurs).map(([name, count]) => ({ name, count }));
      const marquesDistribution = Object.entries(marques).map(([name, count]) => ({ name, count }));

      // Récupérer l'activité récente (les 5 derniers vêtements ajoutés)
      const recentActivity = vetements
        ?.sort((a: Vetement, b: Vetement) => {
          return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
        })
        .slice(0, 5)
        .map((vetement: Vetement) => ({
          type: "vêtement",
          date: vetement.created_at || "",
          description: `Ajout de ${vetement.nom}`,
        }));

      setStats({
        totalVetements: vetements?.length || 0,
        totalTenues: totalTenues || 0,
        totalAmis: amis?.length || 0,
        categoriesDistribution: categoriesDistribution.sort((a, b) => b.count - a.count).slice(0, 5),
        couleursDistribution: couleursDistribution.sort((a, b) => b.count - a.count).slice(0, 5),
        marquesDistribution: marquesDistribution.sort((a, b) => b.count - a.count).slice(0, 5),
        recentActivity: recentActivity || []
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
