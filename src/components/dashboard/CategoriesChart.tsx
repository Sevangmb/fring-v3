
import React from "react";
import Card, { CardHeader, CardTitle, CardDescription } from "@/components/molecules/Card";
import { CardContent } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface CategoriesChartProps {
  categoriesDistribution: Array<{ name: string; count: number }>;
}

const CategoriesChart = ({ categoriesDistribution }: CategoriesChartProps) => {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Distribution par catégorie</CardTitle>
        <CardDescription>Répartition de vos vêtements par catégorie</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="h-72 w-full">
          {categoriesDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoriesDistribution}
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
  );
};

export default CategoriesChart;
