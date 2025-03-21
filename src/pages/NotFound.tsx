
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-md">
          <Heading variant="h1" className="text-6xl font-extrabold mb-6">404</Heading>
          <Text variant="lead" className="mb-8">La page que vous recherchez semble introuvable.</Text>
          <Button onClick={() => navigate("/")} className="mx-auto">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
