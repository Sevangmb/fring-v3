
import React from "react";
import Layout from "@/components/templates/Layout";
import PageHeader from "@/components/organisms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Privacy = () => {
  return (
    <Layout>
      <PageHeader 
        title="Politique de Confidentialité" 
        description="Comment nous protégeons vos données personnelles"
      />
      
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Chez Fring, nous accordons une grande importance à la protection de vos données personnelles. Cette politique de confidentialité vous explique comment nous collectons, utilisons, partageons et protégeons vos informations lorsque vous utilisez notre application.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              En utilisant Fring, vous acceptez les pratiques décrites dans cette politique de confidentialité.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Données collectées</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous collectons les types d'informations suivants:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Informations que vous nous fournissez lors de la création de votre compte (nom, email, etc.)</li>
              <li>Informations sur vos vêtements et ensembles</li>
              <li>Informations sur vos interactions avec d'autres utilisateurs</li>
              <li>Informations techniques sur votre appareil et votre connexion</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Utilisation des données</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous utilisons vos données pour:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Fournir, maintenir et améliorer notre service</li>
              <li>Personnaliser votre expérience</li>
              <li>Communiquer avec vous</li>
              <li>Assurer la sécurité de notre service</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Partage des données</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous ne vendons pas vos données personnelles. Nous pouvons partager certaines informations avec:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>D'autres utilisateurs (selon vos paramètres de confidentialité)</li>
              <li>Nos prestataires de services</li>
              <li>Si la loi l'exige</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Sécurité des données</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données personnelles contre tout accès, modification, divulgation ou destruction non autorisés.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Vos droits</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous avez le droit de:
            </p>
            <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données personnelles</li>
              <li>Supprimer vos données personnelles</li>
              <li>Limiter le traitement de vos données personnelles</li>
              <li>Vous opposer au traitement de vos données personnelles</li>
              <li>Transférer vos données personnelles</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à l'adresse: privacy@fring-app.com
            </p>
          </CardContent>
        </Card>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground text-center">
          Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
        </p>
      </div>
    </Layout>
  );
};

export default Privacy;
