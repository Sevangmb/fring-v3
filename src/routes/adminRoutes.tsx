
import React from 'react';
import { RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/atoms/ProtectedRoute';

// Import admin pages
import Admin from '../pages/Admin';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminVetementsPage from '../pages/admin/AdminVetementsPage';
import AdminEnsemblesPage from '../pages/admin/AdminEnsemblesPage';
import AdminStatsPage from '../pages/admin/AdminStatsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminDatabasePage from '../pages/admin/AdminDatabasePage';

// Helper function to wrap components with ProtectedRoute
const protect = (Component: React.ComponentType) => {
  return <ProtectedRoute><Component /></ProtectedRoute>;
};

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: protect(Admin)
  },
  {
    path: "/admin/users",
    element: protect(AdminUsersPage)
  },
  {
    path: "/admin/vetements",
    element: protect(AdminVetementsPage)
  },
  {
    path: "/admin/ensembles",
    element: protect(AdminEnsemblesPage)
  },
  {
    path: "/admin/stats",
    element: protect(AdminStatsPage)
  },
  {
    path: "/admin/settings",
    element: protect(AdminSettingsPage)
  },
  {
    path: "/admin/database",
    element: protect(AdminDatabasePage)
  }
];
