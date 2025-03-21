
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";

// Dashboard Components
import DashboardStats from "@/components/dashboard/DashboardStats";
import CategoriesChart from "@/components/dashboard/CategoriesChart";
import CouleursChart from "@/components/dashboard/CouleursChart";
import MarquesChart from "@/components/dashboard/MarquesChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import DashboardLoader from "@/components/dashboard/DashboardLoader";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Heading variant="h3" className="mb-2">Bienvenue, {user?.user_metadata?.name || 'Utilisateur'}</Heading>
            <Text variant="subtle">{user?.email} • {user?.user_metadata?.role || 'Utilisateur'}</Text>
          </div>
        </div>

        {isLoading ? (
          <DashboardLoader />
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
