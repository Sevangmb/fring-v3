
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
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 10000 // 10 secondes avant qu'une requête soit considérée comme périmée
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
              
              {/* Main vetements route - now shows all tabs */}
              <Route path="/mes-vetements" element={<ListeVetements />} />
              
              {/* Keep these routes for direct access, but content will be shown in tabs */}
              <Route path="/mes-vetements/ajouter" element={<ListeVetements />} />
              <Route path="/mes-vetements/liste" element={<ListeVetements />} />
              <Route path="/mes-vetements/modifier/:id" element={<ModifierVetement />} />
              <Route path="/mes-amis" element={<MesAmis />} />
              <Route path="/vetements-amis" element={<VetementsAmisPage />} />
              <Route path="/ensembles-amis" element={<EnsemblesAmis />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:friendId" element={<Messages />} />
              <Route path="/mies" element={<MiesPage />} />
              <Route path="/about" element={<About />} />
              
              {/* Ensemble routes - content will be shown in tabs */}
              <Route path="/ensembles" element={<ListeVetements />} />
              <Route path="/ensembles/ajouter" element={<ListeVetements />} />
              <Route path="/ensembles/modifier/:id" element={<ModifierEnsemble />} />
              
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
