
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  // Sample data for the chart
  const chartData = [
    { name: "Jan", users: 4000 },
    { name: "Feb", users: 3000 },
    { name: "Mar", users: 5000 },
    { name: "Apr", users: 4000 },
    { name: "May", users: 7000 },
    { name: "Jun", users: 6000 },
  ];

  // Simulated projects data
  const projectsData = [
    { id: 1, name: "Website Redesign", status: "In Progress", progress: 65 },
    { id: 2, name: "Mobile App Development", status: "Planning", progress: 20 },
    { id: 3, name: "Marketing Campaign", status: "Completed", progress: 100 },
  ];

  const handleLogout = async () => {
    await signOut();
  };

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
            className="mt-4 md:mt-0"
            onClick={handleLogout}
          >
            Déconnexion
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Utilisateurs",
              value: "2,540",
              description: "↑ 12% depuis le mois dernier",
              color: "bg-primary/10 text-primary",
            },
            {
              title: "Projets Actifs",
              value: "12",
              description: "↑ 3 nouveaux cette semaine",
              color: "bg-green-500/10 text-green-500",
            },
            {
              title: "Taux de Conversion",
              value: "5.25%",
              description: "↓ 0.5% depuis le mois dernier",
              color: "bg-orange-500/10 text-orange-500",
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
              <CardTitle>Croissance des Utilisateurs</CardTitle>
              <CardDescription>Utilisateurs actifs mensuels</CardDescription>
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
                  <Bar dataKey="users" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Projets Récents</CardTitle>
              <CardDescription>Statut de vos derniers projets</CardDescription>
            </CardHeader>

            <div className="p-4">
              <div className="space-y-6">
                {projectsData.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex justify-between">
                      <Text weight="medium">{project.name}</Text>
                      <Text
                        variant="small"
                        className={
                          project.status === "Completed"
                            ? "text-green-500"
                            : project.status === "In Progress"
                              ? "text-blue-500"
                              : "text-orange-500"
                        }
                      >
                        {project.status}
                      </Text>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full"
                        style={{ width: `${project.progress}%` }}
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
