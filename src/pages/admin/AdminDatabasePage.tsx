
import React, { useEffect, useState } from 'react';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { isAdmin } from '@/utils/adminUtils';
import { DatabaseStats, getDatabaseStats } from '@/services/database/statsService';
import DatabaseStatsView from '@/components/admin/database/DatabaseStats';
import { useToast } from '@/hooks/use-toast';

const AdminDatabasePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Vérification des autorisations administratives
  const isAuthorized = isAdmin(user);
  
  useEffect(() => {
    const fetchDatabaseStats = async () => {
      try {
        setIsLoading(true);
        const dbStats = await getDatabaseStats();
        setStats(dbStats);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques de la base de données', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les statistiques de la base de données",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchDatabaseStats();
    }
  }, [isAuthorized, toast]);
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAuthorized) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <AdminModuleTemplate 
      title="Base de données" 
      description="Consultez les statistiques et informations sur la base de données."
    >
      {stats ? (
        <DatabaseStatsView stats={stats} isLoading={isLoading} />
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <p>Chargement des statistiques...</p>
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p>Impossible de charger les statistiques</p>
        </div>
      )}
    </AdminModuleTemplate>
  );
};

export default AdminDatabasePage;
