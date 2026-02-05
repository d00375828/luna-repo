// lib/pm/mockMindMap.ts
// Mock data shaped to match your video.
// Later: replace with real GitHub-derived structure.

import type { MindMapData } from "@/components/pm/mindmap/mindmapTypes";

export const mockMindMap: MindMapData = {
  nodes: [
    {
      id: "luna",
      label: "Luna",
      kind: "root",
      description:
        "Top-level view of the product. Click a module to zoom in and see its parts.",
      children: ["frontend", "backend", "shared"],
    },
    {
      id: "frontend",
      label: "Frontend",
      kind: "module",
      description:
        "The web dashboard UI: navigation, mind map visualization, task board, and status panels.",
      children: ["mindmap", "taskboard", "header"],
    },
    {
      id: "backend",
      label: "Backend",
      kind: "module",
      description:
        "Services that ingest GitHub activity and compute summaries for non-technical users.",
      children: ["webhooks", "scoring"],
    },
    {
      id: "shared",
      label: "Shared",
      kind: "module",
      description:
        "Shared data types, formatting helpers, and mapping logic between GitHub activity and UI.",
      children: ["types", "format"],
    },

    // Frontend “files”
    {
      id: "mindmap",
      label: "MindMap.tsx",
      kind: "file",
      path: "components/pm/mindmap/MindMapGraph.tsx",
      description:
        "Displays the interactive force-graph. Lets users click nodes and zoom into modules.",
    },
    {
      id: "taskboard",
      label: "TaskBoard.tsx",
      kind: "file",
      path: "components/pm/tasks/TaskBoard.tsx",
      description:
        "Shows tasks assigned to people. Clicking Start Task will create a branch (later via API).",
    },
    {
      id: "header",
      label: "PMHeader.tsx",
      kind: "file",
      path: "components/pm/header/PMHeader.tsx",
      description:
        "Top navigation: brand, search input, and connect GitHub action.",
    },

    // Backend “files”
    {
      id: "webhooks",
      label: "github-webhook.ts",
      kind: "file",
      path: "worker/webhooks/github.ts",
      description:
        "Receives GitHub events securely and normalizes them into a stream Luna can understand.",
    },
    {
      id: "scoring",
      label: "health-score.ts",
      kind: "file",
      path: "worker/health/score.ts",
      description:
        "Calculates repo health indicators (attention needed vs healthy) from activity patterns.",
    },

    // Shared “files”
    {
      id: "types",
      label: "types.ts",
      kind: "file",
      path: "lib/pm/types.ts",
      description: "Shared domain types for repos, tasks, activity, and mind map nodes.",
    },
    {
      id: "format",
      label: "format.ts",
      kind: "file",
      path: "lib/pm/format.ts",
      description: "Formatting helpers used by UI widgets and cards.",
    },
  ],
  links: [
    { source: "luna", target: "frontend" },
    { source: "luna", target: "backend" },
    { source: "luna", target: "shared" },

    { source: "frontend", target: "mindmap" },
    { source: "frontend", target: "taskboard" },
    { source: "frontend", target: "header" },

    { source: "backend", target: "webhooks" },
    { source: "backend", target: "scoring" },

    { source: "shared", target: "types" },
    { source: "shared", target: "format" },
  ],
};
