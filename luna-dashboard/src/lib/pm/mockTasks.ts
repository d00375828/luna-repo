export type TaskStatus = "not-started" | "in-progress" | "blocked";

export type TaskItem = {
  id: string;
  title: string;
  description: string;
  estimate: string;
  assignee: {
    name: string;
    avatar: string;
  };
  files: string[];
  status: TaskStatus;
  priority: "high" | "medium" | "low";
};

export const mockTasks: TaskItem[] = [
  {
    id: "task-101",
    title: "Component descriptions",
    description: "Surface plain-English explanations for nested nodes.",
    estimate: "3h",
    assignee: { name: "Sloane Evans", avatar: "SE" },
    files: ["components/pm/mindmap/MindMapDetails.tsx"],
    status: "in-progress",
    priority: "high",
  },
  {
    id: "task-102",
    title: "Branch insights panel",
    description: "Visualize active GitHub branches with authors.",
    estimate: "5h",
    assignee: { name: "Carter Diaz", avatar: "CD" },
    files: ["components/pm/branches/BranchList.tsx"],
    status: "not-started",
    priority: "medium",
  },
  {
    id: "task-103",
    title: "Start task branch create",
    description: "Wire Start Task button to create GitHub branch.",
    estimate: "1d",
    assignee: { name: "Tessa Park", avatar: "TP" },
    files: ["lib/github/actions.ts", "lib/github/client.ts"],
    status: "blocked",
    priority: "high",
  },
];
