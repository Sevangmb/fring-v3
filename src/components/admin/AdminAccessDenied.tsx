
import React from 'react';
import Layout from '@/components/templates/Layout';
import { Heading, Text } from '@/components/atoms/Typography';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const AdminAccessDenied: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <Heading variant="h2" className="mb-4">Accès non autorisé</Heading>
          <Text className="mb-8">Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</Text>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default AdminAccessDenied;
