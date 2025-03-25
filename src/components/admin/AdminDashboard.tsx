
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Database, 
  BarChart, 
  Settings,
  Shield
} from "lucide-react";
import AdminHeader from './AdminHeader';
import UserManagement from './UserManagement';
import DataManagement from './DataManagement';
import StatisticsPanel from './StatisticsPanel';
import SystemSettings from './SystemSettings';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader />
      
      <Tabs defaultValue="users" value={activeTab} onValueChange={setActiveTab} className="w-full mt-8">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilisateurs</span>
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Données</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart className="h-4 w-4" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Paramètres</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="border rounded-lg p-6">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="data" className="border rounded-lg p-6">
          <DataManagement />
        </TabsContent>
        
        <TabsContent value="stats" className="border rounded-lg p-6">
          <StatisticsPanel />
        </TabsContent>
        
        <TabsContent value="settings" className="border rounded-lg p-6">
          <SystemSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
