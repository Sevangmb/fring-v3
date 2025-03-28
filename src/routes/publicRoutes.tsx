
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import pages
import Index from '../pages/Index';
import FringPage from '../pages/FringPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/fring",
    element: <FringPage />
  },
  {
    path: "/about",
    element: <FringPage />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "*",
    element: <NotFound />
  }
];
