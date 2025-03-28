
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/atoms/ProtectedRoute';

// Import pages
import MesAmis from '../pages/MesAmis';
import MesFavoris from '../pages/MesFavoris';
import MesVetements from '../pages/MesVetements';
import Messages from '../pages/Messages';
import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';

// Import vetements pages
import AjouterVetement from '../pages/vetements/AjouterVetement';
import ModifierVetement from '../pages/vetements/ModifierVetement';
import VetementsAmis from '../pages/VetementsAmis';
import ListeVetements from '../pages/vetements/ListeVetements';

// Import ensembles pages
import AjouterEnsemble from '../pages/ensembles/AjouterEnsemble';
import ModifierEnsemble from '../pages/ensembles/ModifierEnsemble';
import EnsemblesAmisPage from '../pages/EnsemblesAmisPage';

// Import defis pages
import ResultatsDefi from '../pages/defis/ResultatsDefi';

// Helper function to wrap components with ProtectedRoute
const protect = (Component: React.ComponentType) => {
  return <ProtectedRoute><Component /></ProtectedRoute>;
};

export const authenticatedRoutes: RouteObject[] = [
  {
    path: "/mes-amis",
    element: protect(MesAmis)
  },
  {
    path: "/mes-favoris",
    element: protect(MesFavoris)
  },
  {
    path: "/vetements",
    element: protect(MesVetements)
  },
  {
    path: "/mes-vetements",
    element: protect(MesVetements)
  },
  {
    path: "/messages",
    element: protect(Messages)
  },
  {
    path: "/messages/:id",
    element: protect(Messages)
  },
  {
    path: "/vetements/ajouter",
    element: protect(AjouterVetement)
  },
  {
    path: "/vetements/modifier/:id",
    element: protect(ModifierVetement)
  },
  {
    path: "/vetements/amis",
    element: protect(VetementsAmis)
  },
  {
    path: "/vetements-amis",
    element: protect(VetementsAmis)
  },
  {
    path: "/ensembles/ajouter",
    element: protect(AjouterEnsemble)
  },
  {
    path: "/ensembles/modifier/:id",
    element: protect(ModifierEnsemble)
  },
  {
    path: "/ensembles/amis",
    element: protect(EnsemblesAmisPage)
  },
  {
    path: "/ensembles-amis",
    element: protect(EnsemblesAmisPage)
  },
  {
    path: "/profile",
    element: protect(Profile)
  },
  {
    path: "/dashboard",
    element: protect(Dashboard)
  },
  {
    path: "/defis/:id/resultats",
    element: protect(ResultatsDefi)
  }
];
