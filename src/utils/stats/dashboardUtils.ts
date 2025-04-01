
import { DashboardStats } from "./types";

/**
 * Creates the initial dashboard stats object
 */
export const createEmptyDashboardStats = (): DashboardStats => ({
  totalVetements: 0,
  totalTenues: 0,
  totalAmis: 0,
  categoriesDistribution: [],
  couleursDistribution: [],
  marquesDistribution: [],
  recentActivity: []
});
