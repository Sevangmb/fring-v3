
import React from 'react';
import { DatabaseStats } from '@/services/database/statsService';
import DatabaseStatsCard from './DatabaseStatsCard';
import { Database, User, Shirt, Category } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DatabaseStatsViewProps {
  stats: DatabaseStats;
  isLoading: boolean;
}

const DatabaseStatsView: React.FC<DatabaseStatsViewProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DatabaseStatsCard 
          title="Utilisateurs" 
          value={stats.totalUsers} 
          icon={<User className="h-4 w-4" />}
        />
        <DatabaseStatsCard 
          title="Vêtements" 
          value={stats.totalVetements} 
          icon={<Shirt className="h-4 w-4" />}
        />
        <DatabaseStatsCard 
          title="Ensembles" 
          value={stats.totalEnsembles} 
          icon={<Database className="h-4 w-4" />}
        />
        <DatabaseStatsCard 
          title="Catégories" 
          value={stats.totalCategories} 
          icon={<Category className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières inscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Date d'inscription</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.latestRegistrations.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {formatDistance(new Date(user.created_at), new Date(), {
                      addSuffix: true,
                      locale: fr
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {stats.latestRegistrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center">Aucune inscription récente</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Résumé des tables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead>
                <TableHead className="text-right">Nombre d'enregistrements</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(stats.tableCounts).map(([table, count]) => (
                <TableRow key={table}>
                  <TableCell className="font-medium">{table}</TableCell>
                  <TableCell className="text-right">{count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseStatsView;
