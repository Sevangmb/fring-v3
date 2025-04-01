
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import pages
import Index from '../pages/Index';
import FringPage from '../pages/FringPage';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Privacy from '../pages/Privacy';
import Terms from '../pages/Terms';
import Features from '../pages/Features';
import Docs from '../pages/Docs';
import Messages from '../pages/Messages';

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
    path: "/privacy",
    element: <Privacy />
  },
  {
    path: "/terms",
    element: <Terms />
  },
  {
    path: "/features",
    element: <Features />
  },
  {
    path: "/docs",
    element: <Docs />
  },
  {
    path: "/messages",
    element: <Messages />
  },
  {
    path: "/messages/:friendId",
    element: <Messages />
  },
  {
    path: "*",
    element: <NotFound />
  }
];
