// app/(pm)/dashboard/page.tsx
// The PM dashboard page composed from feature modules.
// Keeps the page readable: it only coordinates layout and wiring.

"use client";

import { useEffect, useRef, useState } from "react";
import Starfield from "@/components/pm/background/Starfield";
import PMHeader from "@/components/pm/header/PMHeader";
import { Toast } from "@/components/pm/ui/Toast";
import MindMapCard from "@/components/pm/mindmap/MindMapCard";
import { mockMindMap } from "@/lib/pm/mockMindMap";
import { BranchList } from "@/components/pm/branches/BranchList";
import { mockBranches } from "@/lib/pm/mockBranches";
import { TaskBoard } from "@/components/pm/tasks/TaskBoard";
import { mockTasks } from "@/lib/pm/mockTasks";

export default function PMDashboardPage() {
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="min-h-screen text-white">
      <Starfield />
      <Toast message={toast} />

      <PMHeader
        query={query}
        onQueryChange={setQuery}
        onConnectGitHub={() => showToast("GitHub connection coming next")}
      />

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        <MindMapCard
          fullData={mockMindMap}
          searchQuery={query}
          onToast={showToast}
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <BranchList branches={mockBranches} />
          <TaskBoard
            tasks={mockTasks}
            onStartTask={(task) =>
              showToast(`Starting ${task.title}... GitHub branch queued`)
            }
          />
        </div>
      </main>
    </div>
  );
}
