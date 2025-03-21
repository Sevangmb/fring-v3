
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulated user data
  const user = {
    name: "Jane Doe",
    email: "jane@example.com",
    role: "Administrator"
  };

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

  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    // Redirect to homepage
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <Heading variant="h3" className="mb-2">Welcome back, {user.name}</Heading>
            <Text variant="subtle">{user.email} • {user.role}</Text>
          </div>
          <Button 
            variant="outline" 
            className="mt-4 md:mt-0"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              title: "Total Users",
              value: "2,540",
              description: "↑ 12% from last month",
              color: "bg-primary/10 text-primary",
            },
            {
              title: "Active Projects",
              value: "12",
              description: "↑ 3 new this week",
              color: "bg-green-500/10 text-green-500",
            },
            {
              title: "Conversion Rate",
              value: "5.25%",
              description: "↓ 0.5% from last month",
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
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly active users over time</CardDescription>
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
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Status of your latest projects</CardDescription>
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
