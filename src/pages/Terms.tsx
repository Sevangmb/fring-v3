
import React from "react";
import Layout from "@/components/templates/Layout";
import PageHeader from "@/components/organisms/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const Terms = () => {
  return (
    <Layout>
      <PageHeader 
        title="Conditions d'Utilisation" 
        description="Les conditions générales d'utilisation de notre service"
      />
      
      <div className="container mx-auto px-4 py-12">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Bienvenue sur Fring. En utilisant notre application, vous acceptez d'être lié par les présentes conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Description du Service</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Fring est une application qui permet aux utilisateurs de gérer leur garde-robe, créer des ensembles vestimentaires, et interagir avec d'autres utilisateurs. Notre service inclut des fonctionnalités de partage de tenues, de recommandations basées sur la météo, et diverses interactions sociales.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Inscription et Comptes</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Pour utiliser certaines fonctionnalités de Fring, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de vos informations de connexion et de toutes les activités qui se produisent sous votre compte.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous acceptez de fournir des informations exactes, actuelles et complètes lors de votre inscription et de les maintenir à jour. Nous nous réservons le droit de suspendre ou de résilier votre compte si nous avons des raisons de croire que les informations fournies sont inexactes ou trompeuses.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Contenu Utilisateur</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              En publiant du contenu sur Fring, vous nous accordez une licence mondiale, non exclusive, libre de redevance pour utiliser, reproduire, modifier, publier et distribuer ce contenu dans le cadre de notre service.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous êtes entièrement responsable du contenu que vous publiez et garantissez que vous avez tous les droits nécessaires pour nous accorder cette licence. Vous acceptez de ne pas publier de contenu illégal, diffamatoire, harcelant, menaçant, discriminatoire ou autrement inapproprié.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Propriété Intellectuelle</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Le service Fring, y compris tout logiciel, application, conception, texte, graphique, logo, et autres contenus, sont la propriété exclusive de Fring ou de ses concédants de licence et sont protégés par les lois sur la propriété intellectuelle.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Vous ne pouvez pas copier, modifier, distribuer, vendre ou louer une partie de notre service sans notre autorisation écrite préalable.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Limitation de Responsabilité</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Fring fournit son service "tel quel" sans garantie d'aucune sorte. Nous ne garantissons pas que le service sera ininterrompu, sécurisé ou exempt d'erreurs.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Dans toute la mesure permise par la loi, Fring ne sera pas responsable des dommages indirects, spéciaux, accessoires, consécutifs ou punitifs découlant de l'utilisation de notre service.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Modifications des Conditions</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Toute modification sera effective dès sa publication sur notre site ou application. Il est de votre responsabilité de consulter régulièrement ces conditions.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              L'utilisation continue de notre service après la publication des modifications constitue votre acceptation de ces modifications.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Résiliation</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Nous nous réservons le droit de suspendre ou de résilier votre accès à notre service, avec ou sans préavis, pour quelque raison que ce soit, y compris, sans limitation, si nous croyons raisonnablement que vous avez violé ces conditions.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-4">Contact</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter à l'adresse: terms@fring-app.com
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

export default Terms;
