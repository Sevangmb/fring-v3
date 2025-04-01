
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AdminNews from '../ensembles/AdminNews';

const AdminNewsSettings: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Gestion des actualités</h3>
        <p className="text-muted-foreground mb-6">
          Créez et gérez les actualités qui seront affichées sur le site.
        </p>
        
        <div className="mt-4">
          <AdminNews />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminNewsSettings;
