"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DEV_BYPASS, DEV_USER } from "@/lib/devSession";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      if (DEV_BYPASS) {
        setSessionEmail(DEV_USER.email);
        setLoading(false);
        return;
      }

      // If not dev bypass, send them to login
      router.push("/login");
    }
    run();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!sessionEmail) return null;

  return (
    <main className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">PM Dashboard</h1>
          <p className="text-sm text-gray-600">
            {DEV_BYPASS ? "Dev Mode" : "Signed in"} as {sessionEmail}
          </p>
        </div>

        <a
          className="text-sm underline"
          href="/login"
          onClick={(e) => {
            if (DEV_BYPASS) {
              e.preventDefault();
              alert("Dev Mode: auth is bypassed.");
            }
          }}
        >
          Sign in
        </a>
      </header>

      <DashboardUI />
    </main>
  );
}

function DashboardUI() {
  // Mock data for UI building
  const orgs = [{ id: "org1", name: "andy (personal)", github_org_id: 123456 }];

  const repos = [
    {
      id: "repo1",
      name: "luna-api-worker",
      default_branch: "main",
      github_repo_id: 9991,
    },
    {
      id: "repo2",
      name: "luna-dashboard",
      default_branch: "main",
      github_repo_id: 9992,
    },
  ];

  const activity = [
    { id: "e1", type: "push", repo: "luna-api-worker", time: "2 min ago" },
    {
      id: "e2",
      type: "pull_request",
      repo: "luna-api-worker",
      time: "1 hr ago",
    },
    { id: "e3", type: "push", repo: "luna-dashboard", time: "yesterday" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card title="Organizations">
        <ul className="space-y-2">
          {orgs.map((o) => (
            <li key={o.id} className="rounded-md border p-2">
              <div className="font-medium">{o.name}</div>
              <div className="text-xs text-gray-600">
                github_org_id: {o.github_org_id}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Repositories">
        <ul className="space-y-2">
          {repos.map((r) => (
            <li key={r.id} className="rounded-md border p-2">
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-gray-600">
                default: {r.default_branch} • github_repo_id: {r.github_repo_id}
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="Recent Activity">
        <ul className="space-y-2">
          {activity.map((a) => (
            <li
              key={a.id}
              className="rounded-md border p-2 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">{a.type}</div>
                <div className="text-xs text-gray-600">{a.repo}</div>
              </div>
              <div className="text-xs text-gray-600">{a.time}</div>
            </li>
          ))}
        </ul>
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
    <section className="rounded-xl border p-4 space-y-3">
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  );
}
