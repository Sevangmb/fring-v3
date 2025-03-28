
import { publicRoutes } from './publicRoutes';
import { authenticatedRoutes } from './authenticatedRoutes';
import { adminRoutes } from './adminRoutes';

export const allRoutes = [
  ...publicRoutes,
  ...authenticatedRoutes,
  ...adminRoutes
];
