
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Box, Typography } from "@mui/material";

const FringPageContent: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Bienvenue sur Fring</CardTitle>
        </CardHeader>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="body1">
              Fring est une application de gestion de garde-robe qui vous permet de:
            </Typography>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Organiser vos vêtements et ensembles</li>
              <li>Créer des tenues pour différentes occasions</li>
              <li>Partager vos styles avec vos amis</li>
              <li>Voter pour les tenues des autres utilisateurs</li>
            </ul>
          </Box>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            Explorez l'application en utilisant le menu de navigation pour découvrir toutes les fonctionnalités.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default FringPageContent;
