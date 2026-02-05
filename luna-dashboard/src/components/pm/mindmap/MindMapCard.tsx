"use client";

// components/pm/mindmap/MindMapCard.tsx
// Feature-level state: selected node, module-focused view, search highlight.

import { useMemo, useState, useEffect, useCallback } from "react";
import { Card } from "@/components/pm/ui/Card";
import MindMapGraph from "./MindMapGraph";
import MindMapDetails from "./MindMapDetails";
import type { MindMapData, MindMapNode } from "./mindmapTypes";

function filterToSubgraph(full: MindMapData, focusId: string): MindMapData {
  const focus = full.nodes.find((n) => n.id === focusId);
  if (!focus?.children?.length) return full;

  const keep = new Set<string>([focus.id, ...focus.children]);
  return {
    nodes: full.nodes.filter((n) => keep.has(n.id)),
    links: full.links.filter(
      (l) => keep.has(String(l.source)) && keep.has(String(l.target))
    ),
  };
}

export default function MindMapCard({
  fullData,
  searchQuery,
  onToast,
}: {
  fullData: MindMapData;
  searchQuery: string;
  onToast: (msg: string) => void;
}) {
  const [selected, setSelected] = useState<MindMapNode | null>(null);
  const [viewFocusId, setViewFocusId] = useState<string | null>(null);
  const searchHit = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    return (
      fullData.nodes.find((n) => {
        const hay = `${n.label} ${n.path ?? ""}`.toLowerCase();
        return hay.includes(q);
      }) ?? null
    );
  }, [searchQuery, fullData]);

  const highlightedId = searchHit?.id ?? null;

  const currentData = useMemo(() => {
    if (!viewFocusId) return fullData;
    return filterToSubgraph(fullData, viewFocusId);
  }, [fullData, viewFocusId]);

  const parentNode = useMemo(() => {
    if (!selected) return null;
    return (
      fullData.nodes.find((n) => n.children?.includes(selected.id)) ?? null
    );
  }, [selected, fullData]);

  // Search: toast when a hit is found.
  useEffect(() => {
    if (!searchHit) return;
    onToast(`Found: ${searchHit.label}`);
  }, [searchHit, searchQuery, onToast]);

  function onSelectNode(n: MindMapNode) {
    setSelected(n);

    if (n.children?.length) {
      setViewFocusId(n.id);
    }
  }

  const backToFullView = useCallback(() => {
    setViewFocusId(null);
  }, []);

  function resetView() {
    setViewFocusId(null);
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <Card title="Codebase Mind Map">
        <MindMapGraph
          data={currentData}
          selectedId={selected?.id ?? null}
          highlightedId={highlightedId}
          onSelectNodeAction={onSelectNode}
          onResetViewAction={resetView}
        />
        <div className="mt-3 text-xs text-white/50">
          Tip: drag to pan, scroll to zoom. Click a module to zoom in.
        </div>
      </Card>

      <MindMapDetails
        node={selected}
        parent={parentNode}
        onBackToFullView={backToFullView}
      />
    </div>
  );
}
