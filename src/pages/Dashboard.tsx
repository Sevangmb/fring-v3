
import React, { useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Button } from "@/components/ui/button";
import { RefreshCw, Shirt, Plus } from "lucide-react";

// Dashboard Components
import DashboardStats from "@/components/dashboard/DashboardStats";
import CategoriesChart from "@/components/dashboard/CategoriesChart";
import CouleursChart from "@/components/dashboard/CouleursChart";
import MarquesChart from "@/components/dashboard/MarquesChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading, error, refetch } = useDashboardStats();

  // Effectue un logging pour le débogage
  useEffect(() => {
    console.log("Dashboard rendered with stats:", stats);
    console.log("Loading state:", isLoading);
    console.log("Error state:", error);
  }, [stats, isLoading, error]);

  const handleRefresh = () => {
    refetch();
  };

  const hasData = 
    stats.totalVetements > 0 || 
    stats.categoriesDistribution.length > 0 || 
    stats.couleursDistribution.length > 0 || 
    stats.marquesDistribution.length > 0;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Heading variant="h3" className="mb-2">Bienvenue, {user?.user_metadata?.name || 'Utilisateur'}</Heading>
            <Text variant="subtle">{user?.email} • {user?.user_metadata?.role || 'Utilisateur'}</Text>
          </div>
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="mt-4 md:mt-0"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>

        {isLoading ? (
          <DashboardLoader />
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive text-center p-8 rounded-lg">
            <Text className="text-destructive mb-4">{error}</Text>
            <Button onClick={handleRefresh}>
              Réessayer
            </Button>
          </div>
        ) : !hasData ? (
          <div className="bg-accent/10 p-10 rounded-lg text-center">
            <Shirt size={48} className="mx-auto text-muted-foreground mb-4" />
            <Heading as="h3" variant="h4" className="mb-2">Aucune donnée disponible</Heading>
            <Text className="text-muted-foreground max-w-md mx-auto mb-6">
              Ajoutez des vêtements à votre collection pour voir apparaître des statistiques ici.
            </Text>
            <Button onClick={() => window.location.href = '/mes-vetements/ajouter'}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un vêtement
            </Button>
          </div>
        ) : (
          <>
            <DashboardStats 
              totalVetements={stats.totalVetements} 
              totalTenues={stats.totalTenues} 
              totalAmis={stats.totalAmis} 
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <CategoriesChart categoriesDistribution={stats.categoriesDistribution} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <CouleursChart couleursDistribution={stats.couleursDistribution} />
              <MarquesChart marquesDistribution={stats.marquesDistribution} />
            </div>

            <RecentActivity activities={stats.recentActivity} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
