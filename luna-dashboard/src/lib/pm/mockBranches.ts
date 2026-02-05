export type BranchStatus = "active" | "idle" | "archived";

export type BranchSummary = {
  name: string;
  owner: {
    name: string;
    avatar: string;
  };
  createdAgo: string;
  commits: number;
  status: BranchStatus;
};

export const mockBranches: BranchSummary[] = [
  {
    name: "feature/mindmap-zoom",
    owner: { name: "Ava Patel", avatar: "AP" },
    createdAgo: "2 hours ago",
    commits: 8,
    status: "active",
  },
  {
    name: "feat/task-orchestration",
    owner: { name: "Leo Martinez", avatar: "LM" },
    createdAgo: "5 hours ago",
    commits: 5,
    status: "idle",
  },
  {
    name: "chore/accessibility-pass",
    owner: { name: "Mika Chen", avatar: "MC" },
    createdAgo: "1 day ago",
    commits: 4,
    status: "active",
  },
  {
    name: "spike/vector-search",
    owner: { name: "Riley Kim", avatar: "RK" },
    createdAgo: "4 days ago",
    commits: 2,
    status: "archived",
  },
];
