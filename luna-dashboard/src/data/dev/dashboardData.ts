import { DEV_USER } from "@/lib/devSession";

export type DevRepo = {
  id: string;
  slug: string;
  name: string;
  description: string;
  defaultBranch: string;
  status: "healthy" | "needs-attention";
  owner: string;
  pushesThisWeek: number;
  files: Array<{
    path: string;
    summary: string;
  }>;
};

export type ActivityItem = {
  id: string;
  repoId: string;
  type: "push" | "deploy" | "pr" | "task";
  summary: string;
  user: string;
  timestamp: string;
  branch?: string;
  file?: string;
};

export type DevTaskStatus = "backlog" | "in-progress" | "review" | "done";

export type DevTask = {
  id: string;
  title: string;
  summary: string;
  owner: string;
  status: DevTaskStatus;
  repoId: string;
  files: string[];
  priority: "low" | "medium" | "high";
  dependsOn?: string[];
};

export type MindMapNode = {
  id: string;
  label: string;
  description: string;
  file?: string;
  children?: MindMapNode[];
};

export type DevPresence = {
  id: string;
  name: string;
  avatar: string;
  taskId: string;
  repoId: string;
  file: string;
  message: string;
  locationUpdatedAt: string;
};

export type GraphNodeType = "file" | "concept" | "person" | "task" | "commit";

export type GraphEdgeType =
  | "import"
  | "dependency"
  | "ownership"
  | "working-on"
  | "blocks";

export type GraphNodeState =
  | "active-dev"
  | "recent-commit"
  | "failing-tests"
  | "idle";

export type MindMapGraphNode = {
  id: string;
  label: string;
  type: GraphNodeType;
  summary: string;
  link?: string;
  state: GraphNodeState;
  layers: Array<"architecture" | "files">;
  position: {
    architecture: { x: number; y: number };
    files?: { x: number; y: number };
  };
};

export type MindMapGraphEdge = {
  id: string;
  from: string;
  to: string;
  type: GraphEdgeType;
};

export type MindMapGraph = {
  nodes: MindMapGraphNode[];
  edges: MindMapGraphEdge[];
};

const minutesAgo = (mins: number) =>
  new Date(Date.now() - mins * 60 * 1000).toISOString();

const repos: DevRepo[] = [
  {
    id: "repo-dashboard",
    slug: "luna-dashboard",
    name: "luna-dashboard",
    description:
      "Next.js app that gives PMs a control center for GitHub installs, Supabase data, and project health.",
    defaultBranch: "main",
    status: "healthy",
    owner: DEV_USER.name,
    pushesThisWeek: 6,
    files: [
      {
        path: "src/app/page.tsx",
        summary: "Dashboard layout, task board interactions, dev mode wiring.",
      },
      {
        path: "src/app/login/page.tsx",
        summary: "Auth UI (currently bypassed) for Supabase sign-in/create.",
      },
      {
        path: "src/data/dev/dashboardData.ts",
        summary: "Mock data for dashboard prototyping.",
      },
    ],
  },
  {
    id: "repo-worker",
    slug: "luna-worker",
    name: "luna-worker",
    description:
      "Cloudflare Worker that receives GitHub webhooks and syncs org/repo metadata into Supabase.",
    defaultBranch: "main",
    status: "needs-attention",
    owner: "API Squad",
    pushesThisWeek: 2,
    files: [
      {
        path: "src/index.ts",
        summary: "Webhook handler + Supabase persistence helpers.",
      },
      {
        path: "wrangler.jsonc",
        summary: "Worker deployment + bindings.",
      },
    ],
  },
];

const activity: ActivityItem[] = [
  {
    id: "act-1",
    repoId: "repo-dashboard",
    type: "push",
    summary: "Polished task board interactions + optimistic updates.",
    user: "Maya",
    timestamp: minutesAgo(8),
    branch: "feature/task-board-polish",
    file: "src/app/page.tsx",
  },
  {
    id: "act-2",
    repoId: "repo-dashboard",
    type: "pr",
    summary: "Add repo overview route + branch helper utilities.",
    user: "Devon",
    timestamp: minutesAgo(26),
    branch: "feature/repo-pages",
    file: "src/app/repos/[repoId]/page.tsx",
  },
  {
    id: "act-3",
    repoId: "repo-worker",
    type: "deploy",
    summary: "Worker ship: installation events now hydrate repos table.",
    user: "Sasha",
    timestamp: minutesAgo(52),
    branch: "deploy/worker-sync",
    file: "src/index.ts",
  },
  {
    id: "act-4",
    repoId: "repo-dashboard",
    type: "task",
    summary: "Drafted mind map spec for PM dashboard navigation.",
    user: "Nia",
    timestamp: minutesAgo(110),
    branch: "notes/mind-map",
    file: "docs/mind-map.md",
  },
];

const tasks: DevTask[] = [
  {
    id: "task-mind-map",
    title: "Interactive mind map for code visibility",
    summary:
      "Display main files + responsibilities so PMs can see who is touching what.",
    owner: "Nia",
    status: "in-progress",
    repoId: "repo-dashboard",
    files: ["src/data/dev/dashboardData.ts", "src/app/page.tsx"],
    priority: "high",
  },
  {
    id: "task-repo-pages",
    title: "Repo overview routes",
    summary: "Dedicated view for each repo with tasks, files, and latest pushes.",
    owner: "Devon",
    status: "review",
    repoId: "repo-dashboard",
    files: ["src/app/repos/[repoId]/page.tsx"],
    priority: "medium",
    dependsOn: ["task-mind-map"],
  },
  {
    id: "task-worker-sync",
    title: "Worker-to-dashboard sync contract",
    summary:
      "Document shape of webhook payload rows we rely on inside the dashboard UI.",
    owner: "Sasha",
    status: "backlog",
    repoId: "repo-worker",
    files: ["docs/data-contract.md", "src/index.ts"],
    priority: "medium",
  },
  {
    id: "task-task-assignment",
    title: "Task assignment UX",
    summary:
      "Allow PMs to assign owners, branch names, and target files before work begins.",
    owner: "Maya",
    status: "done",
    repoId: "repo-dashboard",
    files: ["src/app/page.tsx"],
    priority: "high",
  },
];

const devPresence: DevPresence[] = [
  {
    id: "dev-nia",
    name: "Nia Owens",
    avatar: "NO",
    taskId: "task-mind-map",
    repoId: "repo-dashboard",
    file: "src/components/MindMap.tsx",
    message: "Refining connectors for nested nodes.",
    locationUpdatedAt: minutesAgo(3),
  },
  {
    id: "dev-devon",
    name: "Devon Lee",
    avatar: "DL",
    taskId: "task-repo-pages",
    repoId: "repo-dashboard",
    file: "src/app/repos/[repoId]/page.tsx",
    message: "Hooking activity feed into repo detail.",
    locationUpdatedAt: minutesAgo(9),
  },
  {
    id: "dev-sasha",
    name: "Sasha Park",
    avatar: "SP",
    taskId: "task-worker-sync",
    repoId: "repo-worker",
    file: "docs/data-contract.md",
    message: "Mapping worker payload -> dashboard schema.",
    locationUpdatedAt: minutesAgo(34),
  },
];

/**
 * ✅ Restored: hierarchical tree mind map
 * Used by <MindMap nodes={devDashboardData.mindMap} />
 */
const mindMap: MindMapNode[] = [
  {
    id: "node-dashboard",
    label: "Dashboard Shell",
    description: "Page layout & routing entry point.",
    file: "src/app/page.tsx",
    children: [
      {
        id: "node-layout-area",
        label: "Navigation + Hero",
        description: "Top summary, CTA, and nav state.",
        children: [
          {
            id: "node-layout-file",
            label: "layout.tsx",
            description: "Fonts, global shell, metadata.",
            file: "src/app/layout.tsx",
          },
          {
            id: "node-hero",
            label: "HeroBanner component",
            description: "Sets context + shows dev mode status.",
            file: "src/app/page.tsx#HeroBanner",
          },
          {
            id: "node-sidebar",
            label: "Sidebar component",
            description: "Navigation links + dev mode summary.",
            file: "src/app/page.tsx#Sidebar",
          },
        ],
      },
      {
        id: "node-task-board",
        label: "Task Board",
        description: "Column layout and selection UI.",
        file: "src/app/page.tsx#TaskBoard",
        children: [
          {
            id: "node-task-form",
            label: "Task Composer",
            description: "Creates tasks and assigns owner/repo/status.",
            file: "src/app/page.tsx#handleCreateTask",
          },
          {
            id: "node-task-details",
            label: "TaskDetails panel",
            description: "Suggested branch + repo + files to touch.",
            file: "src/app/page.tsx#TaskDetails",
          },
        ],
      },
      {
        id: "node-graph-area",
        label: "Mind Map + Graph",
        description: "Tree map and interactive node graph side by side.",
        file: "src/app/page.tsx#MindMapGraphCard",
        children: [
          {
            id: "node-dev-data",
            label: "devData mock source",
            description: "Tasks, graph, presence, repos (dev mode).",
            file: "src/data/dev/dashboardData.ts",
          },
        ],
      },
    ],
  },
  {
    id: "node-worker",
    label: "Worker Sync",
    description: "GitHub webhook → Supabase → dashboard surfaces.",
    file: "../luna-worker/src/index.ts",
    children: [
      {
        id: "node-supabase",
        label: "Supabase Tables",
        description: "orgs, repos, webhook_events, users.",
      },
    ],
  },
];

const mindMapGraph: MindMapGraph = {
  nodes: [
    {
      id: "node-root",
      label: "PM Dashboard Core",
      type: "concept",
      summary: "App shell + summaries powering the PM cockpit.",
      link: "/",
      state: "recent-commit",
      layers: ["architecture"],
      position: {
        architecture: { x: 50, y: 28 },
      },
    },
    {
      id: "node-layout",
      label: "src/app/layout.tsx",
      type: "file",
      summary: "Global shell, fonts, metadata.",
      link: "/repos/luna-dashboard",
      state: "idle",
      layers: ["architecture", "files"],
      position: {
        architecture: { x: 30, y: 45 },
        files: { x: 30, y: 60 },
      },
    },
    {
      id: "node-dashboard-file",
      label: "src/app/page.tsx",
      type: "file",
      summary: "Task board, live presence, and graph UI.",
      link: "/repos/luna-dashboard",
      state: "active-dev",
      layers: ["architecture", "files"],
      position: {
        architecture: { x: 55, y: 50 },
        files: { x: 55, y: 75 },
      },
    },
    {
      id: "node-login",
      label: "src/app/login/page.tsx",
      type: "file",
      summary: "Supabase auth UI (currently bypassed).",
      link: "/login",
      state: "recent-commit",
      layers: ["files"],
      position: {
        architecture: { x: 72, y: 40 },
        files: { x: 80, y: 65 },
      },
    },
    {
      id: "node-dev-data",
      label: "src/data/dev/dashboardData.ts",
      type: "file",
      summary: "Mock graph + tasks powering Dev Mode.",
      link: "/repos/luna-dashboard",
      state: "active-dev",
      layers: ["architecture", "files"],
      position: {
        architecture: { x: 40, y: 60 },
        files: { x: 42, y: 88 },
      },
    },
    {
      id: "node-task-mind-map",
      label: "Task: interactive mind map",
      type: "task",
      summary: "Currently being built by Nia (in progress).",
      link: "#tasks",
      state: "active-dev",
      layers: ["architecture", "files"],
      position: {
        architecture: { x: 65, y: 65 },
        files: { x: 70, y: 85 },
      },
    },
    {
      id: "node-dev-nia",
      label: "Nia Owens",
      type: "person",
      summary: "Design lead prototyping the graph UI.",
      state: "active-dev",
      link: "#tasks",
      layers: ["architecture"],
      position: {
        architecture: { x: 80, y: 25 },
      },
    },
    {
      id: "node-worker",
      label: "luna-worker/src/index.ts",
      type: "file",
      summary: "GitHub webhook ingestion + Supabase writes.",
      link: "/repos/luna-worker",
      state: "failing-tests",
      layers: ["architecture"],
      position: {
        architecture: { x: 15, y: 35 },
      },
    },
    {
      id: "node-commit-latest",
      label: "Commit 48b2f1a",
      type: "commit",
      summary: "Adds repo detail route + wiring.",
      link: "/repos/luna-dashboard",
      state: "recent-commit",
      layers: ["files"],
      position: {
        architecture: { x: 20, y: 55 },
        files: { x: 20, y: 78 },
      },
    },
  ],
  edges: [
    {
      id: "edge-core-layout",
      from: "node-root",
      to: "node-layout",
      type: "dependency",
    },
    {
      id: "edge-core-dashboard",
      from: "node-root",
      to: "node-dashboard-file",
      type: "dependency",
    },
    {
      id: "edge-dashboard-devdata",
      from: "node-dashboard-file",
      to: "node-dev-data",
      type: "import",
    },
    {
      id: "edge-task-file",
      from: "node-task-mind-map",
      to: "node-dashboard-file",
      type: "blocks",
    },
    {
      id: "edge-task-person",
      from: "node-dev-nia",
      to: "node-task-mind-map",
      type: "working-on",
    },
    {
      id: "edge-login-core",
      from: "node-login",
      to: "node-root",
      type: "dependency",
    },
    {
      id: "edge-worker-core",
      from: "node-worker",
      to: "node-root",
      type: "dependency",
    },
    {
      id: "edge-commit-dashboard",
      from: "node-commit-latest",
      to: "node-dashboard-file",
      type: "ownership",
    },
  ],
};

export const devDashboardData = {
  repos,
  activity,
  tasks,
  mindMap,
  mindMapGraph,
  devPresence,
};

export function getRepoBySlug(slug: string): DevRepo | undefined {
  return repos.find((repo) => repo.slug === slug);
}

export function groupTasksByStatus(currentTasks: DevTask[]) {
  return currentTasks.reduce<Record<DevTaskStatus, DevTask[]>>(
    (acc, task) => {
      acc[task.status].push(task);
      return acc;
    },
    {
      backlog: [],
      "in-progress": [],
      review: [],
      done: [],
    }
  );
}

const slugify = (input: string) =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);

export function branchNameForTask(task: DevTask, repo: DevRepo | null) {
  const repoSlug = repo?.slug ?? "work";
  return `feature/${repoSlug}-${slugify(task.title)}`;
}
