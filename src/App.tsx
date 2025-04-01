
import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { initializeVoteTables } from './services/database/voteTables';
import { allRoutes } from './routes';
import { useAppInitialization } from './hooks/useAppInitialization';
import { setupAllLogInterceptors } from './services/logs';

// Import styles
import './App.css';

const queryClient = new QueryClient();

// Route rendering component
const AppRoutes = () => {
  const { initialized } = useAppInitialization();
  return useRoutes(allRoutes);
};

// Component qui initialise les tables au démarrage
const AppInitializer = ({ children }: { children: React.ReactNode }) => {
  React.useEffect(() => {
    const initTables = async () => {
      try {
        await initializeVoteTables();
        console.log("Tables de vote initialisées avec succès");
      } catch (error) {
        console.error("Échec de l'initialisation des tables de vote:", error);
      }
    };
    
    // Initialiser les intercepteurs de logs
    const cleanupLogInterceptors = setupAllLogInterceptors();
    
    initTables();
    
    // Nettoyer les intercepteurs lors du démontage
    return () => {
      cleanupLogInterceptors();
    };
  }, []);
  
  return <>{children}</>;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppInitializer>
                <AppRoutes />
                <Toaster />
              </AppInitializer>
            </AuthProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
