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

// Importez vos nouvelles pages de défi ici
import DefiPage from "@/pages/DefiPage";

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
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/defis/:id",
    element: <DefiPage />,
  },
];
