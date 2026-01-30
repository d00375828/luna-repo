"use client";

import {
  ActivityFeed,
} from "@/components/dashboard/ActivityFeed";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DevLocations } from "@/components/dashboard/DevLocations";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { MindMapGraphCard } from "@/components/dashboard/MindMapGraph";
import { RepoSnapshot } from "@/components/dashboard/RepoSnapshot";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { TaskBoard } from "@/components/dashboard/TaskBoard";
import { TaskComposer } from "@/components/dashboard/TaskComposer";
import { TaskDetails } from "@/components/dashboard/TaskDetails";
import { devDashboardData } from "@/data/dev/dashboardData";
import { useDashboardTasks } from "@/hooks/useDashboardTasks";
import { DEV_BYPASS } from "@/lib/devSession";

export default function Home() {
  const {
    tasks,
    groupedTasks,
    selectedTask,
    selectedTaskId,
    setSelectedTaskId,
    summary,
    taskForm,
    updateTaskForm,
    appendTaskFromForm,
  } = useDashboardTasks();

  const selectedRepo = selectedTask
    ? devDashboardData.repos.find((repo) => repo.id === selectedTask.repoId) ??
      null
    : null;

  return (
    <main className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <DashboardHeader
          openTasks={summary.open}
          totalTasks={summary.total}
          repoCount={devDashboardData.repos.length}
        />

        <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
          <SidebarNav devMode={DEV_BYPASS} />

          <div className="space-y-6">
            <HeroBanner />

            <div className="grid gap-6 lg:grid-cols-3">
              <ActivityFeed items={devDashboardData.activity} />
              <DevLocations
                devs={devDashboardData.devPresence}
                repos={devDashboardData.repos}
                tasks={tasks}
              />
              <RepoSnapshot repos={devDashboardData.repos} />
            </div>

            <section className="rounded-2xl border bg-white/70 p-6 shadow-sm">
              <div className="mb-4">
                <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
                  Workbench
                </p>
                <h2 className="text-xl font-semibold">Task Board</h2>
              </div>

              <TaskComposer
                form={taskForm}
                repos={devDashboardData.repos}
                onChange={updateTaskForm}
                onSubmit={appendTaskFromForm}
              />

              <TaskBoard
                groupedTasks={groupedTasks}
                selectedTaskId={selectedTaskId}
                onSelectTask={setSelectedTaskId}
                repos={devDashboardData.repos}
              />
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
              <MindMapGraphCard graph={devDashboardData.mindMapGraph} />
              <TaskDetails
                task={selectedTask}
                repo={selectedRepo}
                branchName={summary.branch}
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
