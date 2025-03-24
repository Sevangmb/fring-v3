
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip"
import { initializeVoteTables } from './services/database/voteTables';

// Import pages
import Index from './pages/Index';
import FringPage from './pages/FringPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MesAmis from './pages/MesAmis';
import MesFavoris from './pages/MesFavoris';
import MesVetements from './pages/MesVetements';
import Messages from './pages/Messages';
import AjouterVetement from './pages/vetements/AjouterVetement';
import ModifierVetement from './pages/vetements/ModifierVetement';
import VetementsAmisPage from './pages/VetementsAmisPage';
import AjouterEnsemble from './pages/ensembles/AjouterEnsemble';
import ModifierEnsemble from './pages/ensembles/ModifierEnsemble';
import EnsemblesAmisPage from './pages/EnsemblesAmisPage';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import ResultatsDefi from './pages/defis/ResultatsDefi';
import ListeVetements from './pages/vetements/ListeVetements';

// Import components
import ProtectedRoute from './components/atoms/ProtectedRoute';

// Import styles
import './App.css';

const queryClient = new QueryClient();

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
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/fring" element={<FringPage />} />
                <Route path="/about" element={<FringPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route path="/mes-amis" element={
                  <ProtectedRoute>
                    <MesAmis />
                  </ProtectedRoute>
                } />
                
                <Route path="/mes-favoris" element={
                  <ProtectedRoute>
                    <MesFavoris />
                  </ProtectedRoute>
                } />
                
                <Route path="/vetements" element={
                  <ProtectedRoute>
                    <MesVetements />
                  </ProtectedRoute>
                } />
                
                {/* Add the missing route for /mes-vetements */}
                <Route path="/mes-vetements" element={
                  <ProtectedRoute>
                    <MesVetements />
                  </ProtectedRoute>
                } />
                
                <Route path="/messages" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                
                <Route path="/messages/:id" element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                } />
                
                <Route path="/vetements/ajouter" element={
                  <ProtectedRoute>
                    <AjouterVetement />
                  </ProtectedRoute>
                } />
                
                <Route path="/vetements/modifier/:id" element={
                  <ProtectedRoute>
                    <ModifierVetement />
                  </ProtectedRoute>
                } />
                
                <Route path="/vetements/amis" element={
                  <ProtectedRoute>
                    <VetementsAmisPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/ensembles/ajouter" element={
                  <ProtectedRoute>
                    <AjouterEnsemble />
                  </ProtectedRoute>
                } />
                
                <Route path="/ensembles/modifier/:id" element={
                  <ProtectedRoute>
                    <ModifierEnsemble />
                  </ProtectedRoute>
                } />
                
                <Route path="/ensembles/amis" element={
                  <ProtectedRoute>
                    <EnsemblesAmisPage />
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/defis/:id/resultats" element={
                  <ProtectedRoute>
                    <ResultatsDefi />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </QueryClientProvider>
        </TooltipProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
