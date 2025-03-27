
import React from 'react';
import Layout from '@/components/templates/Layout';
import { Heading, Text } from '@/components/atoms/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AdminModuleTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const AdminModuleTemplate: React.FC<AdminModuleTemplateProps> = ({
  title,
  description,
  children
}) => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour au tableau de bord
            </Link>
          </Button>
          <Heading variant="h2" className="mb-2">{title}</Heading>
          {description && <Text className="text-muted-foreground">{description}</Text>}
        </div>
        
        <Card className="p-6">
          {children}
        </Card>
      </div>
    </Layout>
  );
};

export default AdminModuleTemplate;
