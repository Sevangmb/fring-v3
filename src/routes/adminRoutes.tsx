
import React from 'react';
import { RouteObject } from 'react-router-dom';

// Import admin pages
import AdminDatabasePage from '@/pages/admin/AdminDatabasePage';
import AdminEnsemblesPage from '@/pages/admin/AdminEnsemblesPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import AdminStatsPage from '@/pages/admin/AdminStatsPage';
import AdminUsersPage from '@/pages/admin/AdminUsersPage';
import AdminVetementsPage from '@/pages/admin/AdminVetementsPage';
import AdminLogsPage from '@/pages/admin/AdminLogsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: "/admin/database",
    element: <AdminDatabasePage />,
  },
  {
    path: "/admin/ensembles",
    element: <AdminEnsemblesPage />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "/admin/stats",
    element: <AdminStatsPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "/admin/vetements",
    element: <AdminVetementsPage />,
  },
  {
    path: "/admin/logs",
    element: <AdminLogsPage />,
  },
];
