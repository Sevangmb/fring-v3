
import React from 'react';
import { Heading } from '@/components/atoms/Typography';
import AdminModuleTemplate from '@/components/admin/AdminModuleTemplate';
import LogsViewer from '@/components/admin/logs/LogsViewer';

const AdminLogsPage: React.FC = () => {
  return (
    <AdminModuleTemplate 
      title="Journaux d'activité système"
      description="Consultez et filtrez les journaux d'activité pour suivre les événements et détecter les problèmes."
    >
      <div className="space-y-6">
        <Heading variant="h3">Journaux d'activité système</Heading>
        <p className="text-muted-foreground">
          Consultez et filtrez les journaux d'activité pour suivre les événements et détecter les problèmes.
        </p>
        
        <LogsViewer />
      </div>
    </AdminModuleTemplate>
  );
};

export default AdminLogsPage;
