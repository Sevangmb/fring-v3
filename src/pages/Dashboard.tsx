
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from "@/components/molecules/Card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading } = useDashboardStats();

  // Couleurs pour les graphiques
  const COLORS = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#F59E0B'];

  // Formatage du texte de statistiques
  const formatStatText = (count: number, text: string) => {
    if (count === 0) return `Aucun ${text}`;
    if (count === 1) return `1 ${text}`;
    return `${count} ${text}s`;
  };

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
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Chargement des statistiques...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                {
                  title: "Total Vêtements",
                  value: formatStatText(stats.totalVetements, "vêtement"),
                  description: stats.totalVetements > 0 
                    ? "Votre garde-robe personnelle" 
                    : "Ajoutez vos premiers vêtements",
                  color: "bg-theme-blue-medium/10 text-theme-blue-medium",
                },
                {
                  title: "Tenues Créées",
                  value: formatStatText(stats.totalTenues, "tenue"),
                  description: stats.totalTenues > 0 
                    ? "Vos tenues personnalisées" 
                    : "Commencez à créer des tenues",
                  color: "bg-theme-turquoise/10 text-theme-turquoise",
                },
                {
                  title: "Amis",
                  value: formatStatText(stats.totalAmis, "ami"),
                  description: stats.totalAmis > 0 
                    ? "Vos relations établies" 
                    : "Ajoutez des amis pour partager",
                  color: "bg-theme-yellow/10 text-theme-yellow",
                },
              ].map((stat, index) => (
                <Card key={index}>
                  <CardHeader>
                    <Text variant="subtle" className="mb-1">{stat.title}</Text>
                    <Heading variant="h3">{stat.value}</Heading>
                    <Text variant="small" className={stat.color}>{stat.description}</Text>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Distribution par catégorie</CardTitle>
                  <CardDescription>Répartition de vos vêtements par catégorie</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="h-72 w-full">
                    {stats.categoriesDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.categoriesDistribution}
                          margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={60}
                          />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" name="Nombre" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution par couleur</CardTitle>
                  <CardDescription>Répartition de vos vêtements par couleur</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="h-64 w-full">
                    {stats.couleursDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={stats.couleursDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="name"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {stats.couleursDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} vêtements`, 'Quantité']} />
                        </PieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribution par marque</CardTitle>
                  <CardDescription>Répartition de vos vêtements par marque</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="h-64 w-full">
                    {stats.marquesDistribution.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={stats.marquesDistribution}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <Tooltip />
                          <Bar dataKey="count" name="Nombre" fill="#D946EF" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        Aucune donnée disponible
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {stats.recentActivity.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Vos derniers ajouts de vêtements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.recentActivity.map((activity, index) => (
                      <div key={index} className="flex justify-between border-b pb-3 last:border-0">
                        <div>
                          <Text weight="medium">{activity.description}</Text>
                          <Text variant="small" className="text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString('fr-FR', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
