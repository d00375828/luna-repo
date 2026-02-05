// components/pm/mindmap/MindMapDetails.tsx
// Right-side panel showing plain-English descriptions.
// This is deliberately separate from the graph so it stays readable.

import { Pill } from "@/components/pm/ui/Pill";
import type { MindMapNode } from "./mindmapTypes";

export default function MindMapDetails({
  node,
  parent,
  onBackToFullView,
}: {
  node: MindMapNode | null;
  parent: MindMapNode | null;
  onBackToFullView: () => void;
}) {
  if (!node) {
    return (
      <div className="rounded-2xl border border-purple-400/10 bg-[#0d0f2c] p-4 text-white/70">
        <div className="text-sm font-semibold text-white/90">
          Code Element Details
        </div>
        <div className="mt-3 text-sm">
          Select a node to view its description.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-400/15 bg-[#0d0f2c] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-white/90">
            Code Element Details
          </div>
          <div className="mt-2 text-lg font-semibold text-white">
            {node.label}
          </div>
          <div className="mt-1 flex flex-wrap gap-2">
            <Pill>{node.kind}</Pill>
            {node.path && <Pill>{node.path}</Pill>}
          </div>
        </div>

        <button
          onClick={onBackToFullView}
          className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/15"
        >
          Back to Full View
        </button>
      </div>

      <div className="mt-4 text-sm text-white/75 leading-relaxed">
        {node.description}
      </div>

      {parent ? (
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wide text-white/50">
            Parent Element
          </div>
          <div className="mt-2 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{parent.label}</span>
              <Pill>{parent.kind}</Pill>
            </div>
            <div className="mt-1 text-xs text-white/60">{parent.description}</div>
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wide text-white/50">
          Technical Details
        </div>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
            <span>Type</span>
            <span className="text-white/60">{node.kind}</span>
          </div>
          {node.path ? (
            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
              <span>Path</span>
              <span className="text-white/60">{node.path}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
            <span>ID</span>
            <span className="text-white/60">{node.id}</span>
          </div>
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/80">
            <span>Children</span>
            <span className="text-white/60">{node.children?.length ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
