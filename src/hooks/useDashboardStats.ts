
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Vetement } from "@/services/vetement";
import { useToast } from "@/hooks/use-toast";
import {
  fetchVetementsStats,
  fetchTenutesCount,
  fetchAmisCount,
  calculateDistributions,
  prepareRecentActivity
} from "@/utils/statsUtils";

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
  const { toast } = useToast();
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
      console.log("Début de récupération des statistiques pour l'utilisateur:", user.id);

      // Récupérer les vêtements - utilisez un LEFT JOIN au lieu d'une jointure implicite
      // en spécifiant explicitement la relation à utiliser (vetements_categorie_id_fkey)
      const { data: vetements, error: vetementsError } = await supabase
        .from('vetements')
        .select(`
          id, nom, couleur, taille, description, marque, image_url, created_at, user_id,
          categories!vetements_categorie_id_fkey(id, nom)
        `)
        .eq('user_id', user.id);

      if (vetementsError) {
        console.error("Erreur lors de la récupération des vêtements:", vetementsError);
        throw vetementsError;
      }
      console.log("Vêtements récupérés:", vetements?.length || 0);

      // Récupérer le nombre de tenues
      const { count: tenuesCount, error: tenuesError } = await supabase
        .from('tenues')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (tenuesError) {
        console.error("Erreur lors de la récupération des tenues:", tenuesError);
        throw tenuesError;
      }
      console.log("Nombre de tenues:", tenuesCount || 0);

      // Récupérer le nombre d'amis
      const { data: amis, error: amisError } = await supabase
        .from('amis')
        .select('*')
        .or(`user_id.eq.${user.id},ami_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (amisError) {
        console.error("Erreur lors de la récupération des amis:", amisError);
        throw amisError;
      }
      console.log("Nombre d'amis:", amis?.length || 0);

      // Calculer les distributions
      const categorieCount: Record<string, number> = {};
      const couleurCount: Record<string, number> = {};
      const marqueCount: Record<string, number> = {};

      vetements?.forEach((vetement: any) => {
        // Catégories - utiliser la relation explicite
        if (vetement.categories && vetement.categories.nom) {
          const categoryName = vetement.categories.nom;
          categorieCount[categoryName] = (categorieCount[categoryName] || 0) + 1;
        }

        // Couleurs
        if (vetement.couleur) {
          couleurCount[vetement.couleur] = (couleurCount[vetement.couleur] || 0) + 1;
        }

        // Marques
        if (vetement.marque) {
          marqueCount[vetement.marque] = (marqueCount[vetement.marque] || 0) + 1;
        }
      });

      console.log("Distributions calculées:", {
        categories: Object.keys(categorieCount).length,
        couleurs: Object.keys(couleurCount).length,
        marques: Object.keys(marqueCount).length
      });

      // Transformer en tableaux pour les graphiques
      const categoriesDistribution = Object.entries(categorieCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const couleursDistribution = Object.entries(couleurCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const marquesDistribution = Object.entries(marqueCount)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Préparer l'activité récente
      const recentActivity = (vetements || [])
        .sort((a: Vetement, b: Vetement) => {
          return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
        })
        .slice(0, 5)
        .map((vetement: Vetement) => ({
          type: "vêtement",
          date: vetement.created_at || "",
          description: `Ajout de ${vetement.nom}`,
        }));

      // Mettre à jour l'état avec toutes les données récupérées
      setStats({
        totalVetements: vetements?.length || 0,
        totalTenues: tenuesCount || 0,
        totalAmis: amis?.length || 0,
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
