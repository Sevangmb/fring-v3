
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import admin pages
import Admin from '../pages/Admin';
import AdminDatabasePage from '../pages/admin/AdminDatabasePage';
import AdminEnsemblesPage from '../pages/admin/AdminEnsemblesPage';
import AdminLogsPage from '../pages/admin/AdminLogsPage';
import AdminSettingsPage from '../pages/admin/AdminSettingsPage';
import AdminStatsPage from '../pages/admin/AdminStatsPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminVetementsPage from '../pages/admin/AdminVetementsPage';

// Admin routes configuration
export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <Admin />,
  },
  {
    path: '/admin/database',
    element: <AdminDatabasePage />,
  },
  {
    path: '/admin/ensembles',
    element: <AdminEnsemblesPage />,
  },
  {
    path: '/admin/logs',
    element: <AdminLogsPage />,
  },
  {
    path: '/admin/settings',
    element: <AdminSettingsPage />,
  },
  {
    path: '/admin/stats',
    element: <AdminStatsPage />,
  },
  {
    path: '/admin/users',
    element: <AdminUsersPage />,
  },
  {
    path: '/admin/vetements',
    element: <AdminVetementsPage />,
  },
];
