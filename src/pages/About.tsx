
import React from 'react';
import Layout from '@/components/templates/Layout';
import PageHeader from '@/components/organisms/PageHeader';
import { Text } from '@/components/atoms/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <PageHeader 
        title="À propos" 
        description="Découvrez notre application de gestion de garde-robe"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Notre application</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Text>
              Bienvenue dans notre application de gestion de garde-robe. Cette plateforme vous permet 
              d'organiser vos vêtements, créer des ensembles, participer à des défis de mode et 
              partager vos créations avec vos amis.
            </Text>
            
            <Text>
              Avec notre application, vous pouvez:
            </Text>
            
            <ul className="list-disc pl-5 space-y-2">
              <li>Cataloguer tous vos vêtements avec photos et informations détaillées</li>
              <li>Créer des ensembles pour différentes occasions</li>
              <li>Participer à des défis de mode et voter pour vos ensembles préférés</li>
              <li>Ajouter des amis et découvrir leurs collections</li>
              <li>Sauvegarder vos ensembles et vêtements favoris</li>
              <li>Discuter avec vos amis via notre système de messagerie</li>
            </ul>
            
            <Text>
              Notre mission est de vous aider à tirer le meilleur parti de votre garde-robe tout en 
              vous inspirant avec de nouvelles idées de tenues.
            </Text>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AboutPage;
