"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { DEV_BYPASS, DEV_USER } from "@/lib/devSession";
import { supabase } from "@/lib/supabaseClient";
import { AnyRecord } from "dns";

type Org = {
  id: string;
  name: string;
  github_org_id: number | null;
};

type Repo = {
  id: string;
  name: string;
  default_branch: string | null;
  github_repo_id: number | null;
};

type ActivityRow = {
  id: string;
  event_type: string;
  repo_name: string;
  created_at: string;
};

type DashboardData = {
  orgs: Org[];
  repos: Repo[];
  activity: ActivityRow[];
};

const EMPTY_DATA: DashboardData = {
  orgs: [],
  repos: [],
  activity: [],
};

export default function Home() {
  const router = useRouter();
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>(EMPTY_DATA);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = useCallback(async () => {
    const [orgsRes, reposRes, eventsRes] = await Promise.all([
      supabase
        .from("orgs")
        .select("id,name,github_org_id")
        .order("name", { ascending: true }),
      supabase
        .from("repos")
        .select("id,name,default_branch,github_repo_id")
        .order("name", { ascending: true }),
      supabase
        .from("webhook_events")
        .select("id,event_type,github_repo_id,created_at,repo:repos(name)")
        .order("created_at", { ascending: false })
        .limit(15),
    ]);

    const firstError = orgsRes.error || reposRes.error || eventsRes.error;
    if (firstError) {
      throw firstError;
    }
    type WebhookEventRow = {
      id: string;
      event_type: string;
      github_repo_id: number | null;
      created_at: string;
      repo: { name: string | null }[]; // <-- array
    };

    const activity = ((eventsRes.data ?? []) as WebhookEventRow[]).map(
      (row) => ({
        id: row.id,
        event_type: row.event_type,
        repo_name:
          row.repo?.[0]?.name ??
          (row.github_repo_id ? `repo #${row.github_repo_id}` : "Unknown repo"),
        created_at: row.created_at,
      })
    );

    setDashboardData({
      orgs: orgsRes.data ?? [],
      repos: reposRes.data ?? [],
      activity,
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      setError(null);
      try {
        if (DEV_BYPASS) {
          if (!cancelled) {
            setSessionEmail(DEV_USER.email);
          }
        } else {
          const {
            data: { session },
            error: sessionError,
          } = await supabase.auth.getSession();

          if (sessionError) {
            throw sessionError;
          }

          if (!session) {
            router.push("/login");
            return;
          }

          if (!cancelled) {
            setSessionEmail(session.user.email ?? null);
          }
        }

        await loadDashboardData();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load dashboard data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, [router, loadDashboardData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      await loadDashboardData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh dashboard."
      );
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboardData]);

  const summary = useMemo(
    () => ({
      orgCount: dashboardData.orgs.length,
      repoCount: dashboardData.repos.length,
      activityCount: dashboardData.activity.length,
    }),
    [dashboardData]
  );

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!sessionEmail) {
    return null;
  }

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">PM Dashboard</h1>
          <p className="text-sm text-gray-600">
            {DEV_BYPASS ? "Dev Mode" : "Signed in"} as {sessionEmail}
          </p>
          <p className="text-xs text-gray-500">
            {summary.orgCount} orgs • {summary.repoCount} repos •{" "}
            {summary.activityCount} recent events
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="rounded-lg border px-3 py-2 text-sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh data"}
          </button>
          <a className="text-sm underline" href="/login">
            Switch account
          </a>
        </div>
      </header>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <DashboardUI data={dashboardData} />
    </main>
  );
}

function DashboardUI({ data }: { data: DashboardData }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Organizations">
        {data.orgs.length === 0 ? (
          <EmptyState message="No orgs yet. Connect your GitHub app to see installs." />
        ) : (
          <ul className="space-y-2">
            {data.orgs.map((o) => (
              <li key={o.id} className="rounded-md border p-2">
                <div className="font-medium">{o.name}</div>
                {o.github_org_id && (
                  <div className="text-xs text-gray-600">
                    github_org_id: {o.github_org_id}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Repositories">
        {data.repos.length === 0 ? (
          <EmptyState message="No repos yet. Trigger a GitHub event to hydrate data." />
        ) : (
          <ul className="space-y-2">
            {data.repos.map((r) => (
              <li key={r.id} className="rounded-md border p-2">
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-gray-600">
                  default: {r.default_branch ?? "n/a"} • github_repo_id:{" "}
                  {r.github_repo_id ?? "n/a"}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Recent Activity">
        {data.activity.length === 0 ? (
          <EmptyState message="No webhook events yet." />
        ) : (
          <ul className="space-y-2">
            {data.activity.map((a) => (
              <li
                key={a.id}
                className="rounded-md border p-2 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="font-medium capitalize">{a.event_type}</div>
                  <div className="text-xs text-gray-600">{a.repo_name}</div>
                </div>
                <div className="text-xs text-gray-600 whitespace-nowrap">
                  {formatDate(a.created_at)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="md:col-span-3">
        <Card title="Task Board (Coming next)">
          <div className="grid gap-3 md:grid-cols-4">
            {["Todo", "In Progress", "Blocked", "Done"].map((col) => (
              <div key={col} className="rounded-xl border p-3">
                <div className="font-semibold mb-2">{col}</div>
                <div className="text-sm text-gray-600">
                  Drop tasks here (we’ll wire it later).
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border p-4 space-y-3 bg-white">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed p-4 text-sm text-gray-500 text-center">
      {message}
    </div>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
