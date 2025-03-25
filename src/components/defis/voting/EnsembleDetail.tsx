
import React from "react";
import { Avatar, Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { VoteType } from "@/services/votes/types";
import VoteButtons from "./VoteButtons";

interface EnsembleDetailProps {
  ensemble: any;
  votes?: { up: number; down: number };
  ensembleId?: number;
  userVote?: VoteType;
  vetementsByType?: Record<string, any[]>;
  onVote?: (vote: VoteType) => void;
  isLoading?: boolean;
  connectionError?: boolean;
}

const EnsembleDetail: React.FC<EnsembleDetailProps> = ({ 
  ensemble, 
  votes,
  ensembleId,
  userVote,
  vetementsByType,
  onVote,
  isLoading,
  connectionError
}) => {
  if (!ensemble) return null;
  
  const createdAt = ensemble.created_at ? new Date(ensemble.created_at) : new Date();
  const timeAgo = formatDistance(createdAt, new Date(), { addSuffix: true, locale: fr });
  
  // Organise les vêtements par catégorie pour l'affichage
  const vetements = ensemble.vetements || [];
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {ensemble.description && (
        <Typography variant="body2" color="text.secondary">
          {ensemble.description}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {vetements.map((item: any) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card variant="outlined" sx={{ overflow: 'hidden' }}>
              <CardContent sx={{ p: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    src={item.vetement?.image_url}
                    alt={item.vetement?.nom || "Vêtement"}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  >
                    {item.vetement?.nom?.charAt(0) || "V"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">
                      {item.vetement?.nom}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {item.vetement?.marque}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {onVote && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <VoteButtons
            userVote={userVote}
            onVote={onVote}
            isLoading={isLoading}
            disabled={connectionError}
            connectionError={connectionError}
            size="md"
          />
        </Box>
      )}
      
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ textAlign: 'right', mt: 1 }}
      >
        Publié {timeAgo}
      </Typography>
    </Box>
  );
};

export default EnsembleDetail;
