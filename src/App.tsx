
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeVoteTables } from './services/database/voteTables';
import { allRoutes } from './routes';

// Import styles
import './App.css';

const queryClient = new QueryClient();

// Route rendering component
const AppRoutes = () => {
  return useRoutes(allRoutes);
};

function App() {
  // Initialize vote tables on app start
  useEffect(() => {
    const initTables = async () => {
      try {
        await initializeVoteTables();
      } catch (error) {
        console.error("Failed to initialize vote tables:", error);
      }
    };
    
    initTables();
  }, []);
  
  return (
    <div className="App">
      <BrowserRouter>
        <TooltipProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppRoutes />
            </AuthProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
