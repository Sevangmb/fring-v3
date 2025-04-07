
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import pages
import Home from '../pages/Home';
import Fring from '../pages/Fring';
import Connexion from '../pages/Connexion';
import Inscription from '../pages/Inscription';
import MotDePasseOublie from '../pages/MotDePasseOublie';
import NouvelleCollection from '../pages/NouvelleCollection';
import Confidentialite from '../pages/Confidentialite';
import Conditions from '../pages/Conditions';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

// Import defi pages
import DefiPage from "@/pages/DefiPage";
import ResultatsDefi from "@/pages/defis/ResultatsDefi";

// Import admin routes
import { adminRoutes } from './adminRoutes';

export const allRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/fring",
    element: <Fring />,
  },
  {
    path: "/connexion",
    element: <Connexion />,
  },
  {
    path: "/inscription",
    element: <Inscription />,
  },
  {
    path: "/mot-de-passe-oublie",
    element: <MotDePasseOublie />,
  },
  {
    path: "/nouvelle-collection",
    element: <NouvelleCollection />,
  },
  {
    path: "/confidentialite",
    element: <Confidentialite />,
  },
  {
    path: "/conditions",
    element: <Conditions />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  // Important: route plus spécifique d'abord
  {
    path: "/defis/resultats/:id",
    element: <ResultatsDefi />,
  },
  {
    path: "/defis/:id",
    element: <DefiPage />,
  },
  // Include admin routes
  ...adminRoutes,
  // La route catch-all doit toujours être en dernier
  {
    path: "*",
    element: <NotFound />,
  },
];
