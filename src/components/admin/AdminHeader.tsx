
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="bg-primary p-3 rounded-lg">
        <Shield className="h-8 w-8 text-primary-foreground" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground">
          Gérez les utilisateurs, les données et les paramètres du système
        </p>
      </div>
    </div>
  );
};

export default AdminHeader;
