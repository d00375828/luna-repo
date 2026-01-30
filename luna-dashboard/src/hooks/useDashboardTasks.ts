import { useMemo, useState } from "react";

import {
  branchNameForTask,
  devDashboardData,
  DevTask,
  DevTaskStatus,
  groupTasksByStatus,
} from "@/data/dev/dashboardData";
import { DEV_USER } from "@/lib/devSession";

export type TaskFormState = {
  title: string;
  owner: string;
  repoId: string;
  status: DevTaskStatus;
  priority: "low" | "medium" | "high";
};

const DEFAULT_FORM: TaskFormState = {
  title: "",
  owner: devDashboardData.devPresence[0]?.name ?? DEV_USER.name,
  repoId: devDashboardData.repos[0]?.id ?? "",
  status: "backlog",
  priority: "medium",
};

export function useDashboardTasks(initialTasks = devDashboardData.tasks) {
  const [tasks, setTasks] = useState<DevTask[]>(initialTasks);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(
    initialTasks[0]?.id ?? null,
  );
  const [taskForm, setTaskForm] = useState<TaskFormState>(DEFAULT_FORM);

  const groupedTasks = useMemo(
    () => groupTasksByStatus(tasks),
    [tasks],
  );

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [tasks, selectedTaskId],
  );

  const summary = useMemo(() => {
    const total = tasks.length;
    const open = tasks.filter((task) => task.status !== "done").length;
    return {
      total,
      open,
      branch: selectedTask
        ? branchNameForTask(
            selectedTask,
            devDashboardData.repos.find((repo) => repo.id === selectedTask.repoId) ?? null,
          )
        : null,
    };
  }, [tasks, selectedTask]);

  function updateTaskForm(updates: Partial<TaskFormState>) {
    setTaskForm((prev) => ({ ...prev, ...updates }));
  }

  function resetTaskForm() {
    setTaskForm(DEFAULT_FORM);
  }

  function appendTaskFromForm() {
    if (!taskForm.title.trim()) {
      return null;
    }

    const newTask: DevTask = {
      id: `task-${Date.now()}`,
      title: taskForm.title.trim(),
      summary: "Draft task created in dev mode.",
      owner: taskForm.owner,
      status: taskForm.status,
      repoId: taskForm.repoId || devDashboardData.repos[0]?.id || "repo-dashboard",
      files: [],
      priority: taskForm.priority,
    };

    setTasks((prev) => [newTask, ...prev]);
    setSelectedTaskId(newTask.id);
    resetTaskForm();
    return newTask;
  }

  return {
    tasks,
    groupedTasks,
    selectedTask,
    selectedTaskId,
    setSelectedTaskId,
    summary,
    taskForm,
    updateTaskForm,
    resetTaskForm,
    appendTaskFromForm,
    setTasks,
  };
}
