import type {
  ActivityItem,
  DevRepo,
  DevTask,
  MindMapGraph,
} from "../dev/dashboardData";

/**
 * Placeholder Supabase-facing APIs. These will eventually call
 * `@supabase/supabase-js`, but we keep stubs so dashboard components
 * can swap data providers without code churn.
 */

export async function fetchRepos(): Promise<DevRepo[]> {
  // TODO: replace with Supabase query (repos table)
  return [];
}

export async function fetchActivity(): Promise<ActivityItem[]> {
  // TODO: replace with Supabase query (webhook_events table)
  return [];
}

export async function fetchTasks(): Promise<DevTask[]> {
  // TODO: replace with Supabase query (tasks table)
  return [];
}

export async function fetchMindMap(): Promise<MindMapGraph> {
  // TODO: replace with Supabase materialized view or computed builder
  return { nodes: [], edges: [] };
}
