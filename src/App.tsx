
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/atoms/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import MesVetements from "./pages/MesVetements";
import AjouterVetement from "./pages/vetements/AjouterVetement";
import ListeVetements from "./pages/vetements/ListeVetements";
import ModifierVetement from "./pages/vetements/ModifierVetement";
import MesAmis from "./pages/MesAmis";
import Messages from "./pages/Messages";
import About from "./pages/About";
import MiesPage from "./pages/Mies";
import MesEnsembles from "./pages/ensembles/MesEnsembles";
import AjouterEnsemble from "./pages/ensembles/AjouterEnsemble";
import ModifierEnsemble from "./pages/ensembles/ModifierEnsemble";
import VetementsAmisPage from "./pages/VetementsAmisPage";
import EnsemblesAmis from "./pages/EnsemblesAmis";

// Create a new query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000 // 30 secondes avant qu'une requête soit considérée comme périmée
    }
  }
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Vêtements Routes */}
              <Route path="/mes-vetements" element={
                <ProtectedRoute>
                  <ListeVetements />
                </ProtectedRoute>
              } />
              <Route path="/mes-vetements/ajouter" element={
                <ProtectedRoute>
                  <AjouterVetement />
                </ProtectedRoute>
              } />
              <Route path="/mes-vetements/liste" element={
                <ProtectedRoute>
                  <ListeVetements />
                </ProtectedRoute>
              } />
              <Route path="/mes-vetements/modifier/:id" element={
                <ProtectedRoute>
                  <ModifierVetement />
                </ProtectedRoute>
              } />
              
              {/* Ensembles Routes */}
              <Route path="/ensembles" element={
                <ProtectedRoute>
                  <MesEnsembles />
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
              
              {/* Social Routes */}
              <Route path="/mes-amis" element={
                <ProtectedRoute>
                  <MesAmis />
                </ProtectedRoute>
              } />
              <Route path="/vetements-amis" element={
                <ProtectedRoute>
                  <VetementsAmisPage />
                </ProtectedRoute>
              } />
              <Route path="/ensembles-amis" element={
                <ProtectedRoute>
                  <EnsemblesAmis />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              <Route path="/messages/:friendId" element={
                <ProtectedRoute>
                  <Messages />
                </ProtectedRoute>
              } />
              
              {/* Autres Routes */}
              <Route path="/mies" element={
                <ProtectedRoute>
                  <MiesPage />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              
              {/* Fallback Routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
