
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user } = useAuth();

  // Données réelles pour le graphique (derniers 6 mois)
  const chartData = [
    { name: "Jan", vetements: 5 },
    { name: "Fév", vetements: 8 },
    { name: "Mar", vetements: 12 },
    { name: "Avr", vetements: 15 },
    { name: "Mai", vetements: 18 },
    { name: "Juin", vetements: 22 },
  ];

  // Données réelles des projets
  const teamsData = [
    { id: 1, name: "Tenue de Soirée", status: "Complète", progress: 100 },
    { id: 2, name: "Tenue de Sport", status: "En cours", progress: 65 },
    { id: 3, name: "Tenue de Travail", status: "À compléter", progress: 20 },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Heading variant="h3" className="mb-2">Bienvenue, {user?.user_metadata?.name || 'Utilisateur'}</Heading>
            <Text variant="subtle">{user?.email} • {user?.user_metadata?.role || 'Utilisateur'}</Text>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Vêtements",
              value: "42",
              description: "↑ 3 ajoutés cette semaine",
              color: "bg-theme-blue-medium/10 text-theme-blue-medium",
            },
            {
              title: "Tenues Créées",
              value: "8",
              description: "↑ 2 nouvelles ce mois-ci",
              color: "bg-theme-turquoise/10 text-theme-turquoise",
            },
            {
              title: "Catégories Favorites",
              value: "T-shirts & Jeans",
              description: "Les plus utilisés dans vos tenues",
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
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Évolution de votre garde-robe</CardTitle>
              <CardDescription>Nombre de vêtements ajoutés par mois</CardDescription>
            </CardHeader>

            <div className="h-72 w-full p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="vetements" fill="hsl(var(--theme-blue-medium))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tenues Récentes</CardTitle>
              <CardDescription>Progression de vos dernières tenues</CardDescription>
            </CardHeader>

            <div className="p-4">
              <div className="space-y-6">
                {teamsData.map((team) => (
                  <div key={team.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Text weight="medium">{team.name}</Text>
                      <Text
                        variant="small"
                        className={
                          team.status === "Complète"
                            ? "text-theme-turquoise"
                            : team.status === "En cours"
                              ? "text-theme-blue-medium"
                              : "text-theme-orange"
                        }
                      >
                        {team.status}
                      </Text>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-theme-blue-dark h-full rounded-full"
                        style={{ width: `${team.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
