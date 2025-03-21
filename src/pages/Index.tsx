
import React from "react";
import Layout from "@/components/templates/Layout";
import { Heading, Text } from "@/components/atoms/Typography";

const Index = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <Heading variant="h1" className="mb-6 text-center">
          Welcome to Multi-User App
        </Heading>
        <Text className="text-center mb-8">
          This is a starter template for building multi-user applications with React, Atomic Design, and modern UI components.
        </Text>
      </div>
    </Layout>
  );
};

export default Index;
