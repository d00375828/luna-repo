"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import type {
  ForceGraphMethods,
  NodeObject,
  ForceGraphProps,
} from "react-force-graph-2d";
import type { MindMapData, MindMapNode } from "./mindmapTypes";

type GraphNode = MindMapNode & NodeObject;
type GraphLink = { source: string | GraphNode; target: string | GraphNode };

// ✅ IMPORTANT: library wants `undefined` not `null` for the ref current.
type GraphMethods = ForceGraphMethods<GraphNode, GraphLink>;

// ✅ Pin the generics so all callbacks get GraphNode (with label/kind/description).
const ForceGraph2DBase = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

const ForceGraph2DTyped =
  ForceGraph2DBase as unknown as React.ForwardRefExoticComponent<
    ForceGraphProps<GraphNode, GraphLink> & React.RefAttributes<GraphMethods>
  >;

function nodeColor(n: MindMapNode, highlightedId: string | null) {
  if (highlightedId && n.id === highlightedId) return "#FACC15";
  if (n.kind === "root") return "#8B5CF6";
  if (n.kind === "module") return "#60A5FA";
  return "#A78BFA";
}

export default function MindMapGraph({
  data,
  selectedId,
  highlightedId,
  onSelectNodeAction,
  onResetViewAction,
}: {
  data: MindMapData;
  selectedId: string | null;
  highlightedId: string | null;
  onSelectNodeAction: (node: MindMapNode) => void;
  onResetViewAction: () => void;
}) {
  // ✅ useRef returns a MutableRefObject; keep current as undefined initially.
  const fgRef = useRef<GraphMethods | null>(null);

  const graphData = useMemo(() => {
    return {
      nodes: data.nodes as GraphNode[],
      links: data.links.map((l) => ({
        source: l.source,
        target: l.target,
      })) as GraphLink[],
    };
  }, [data]);

  const nodeById = useMemo(() => {
    const m = new Map<string, GraphNode>();
    for (const n of graphData.nodes) m.set(n.id, n);
    return m;
  }, [graphData.nodes]);

  const focusNode = useCallback(
    (id: string, zoom = 2.0, ms = 650) => {
      const fg = fgRef.current;
      const target = nodeById.get(id);
      if (!fg || !target) return;

      if (typeof target.x !== "number" || typeof target.y !== "number") return;

      fg.centerAt(target.x, target.y, ms);
      fg.zoom(zoom, ms);
    },
    [nodeById]
  );

  useEffect(() => {
    if (!highlightedId) return;
    let tries = 0;
    const tick = () => {
      tries += 1;
      focusNode(highlightedId, 2.1, 650);
      if (tries < 8) requestAnimationFrame(tick);
    };
    tick();
  }, [highlightedId, focusNode]);

  const zoomIn = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const next = Math.min((fg.zoom() || 1) * 1.18, 6);
    fg.zoom(next, 200);
  }, []);

  const zoomOut = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const next = Math.max((fg.zoom() || 1) / 1.18, 0.35);
    fg.zoom(next, 200);
  }, []);

  const reset = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;

    onResetViewAction();
    fg.centerAt(0, 0, 450);
    fg.zoom(1, 450);
  }, [onResetViewAction]);

  return (
    <div className="relative h-[520px] w-full overflow-hidden rounded-2xl border border-purple-400/15 bg-[#0a0f2a]">
      <ForceGraph2DTyped
        ref={fgRef}
        graphData={graphData}
        enablePanInteraction
        enableZoomInteraction
        minZoom={0.35}
        maxZoom={6}
        nodeLabel={(n) => n.label}
        linkColor={() => "rgba(255,255,255,0.12)"}
        nodeRelSize={6}
        cooldownTicks={80}
        onNodeClick={(n) => {
          onSelectNodeAction(n);

          const targetZoom = n.children?.length
            ? 2.0
            : Math.min(fgRef.current?.zoom?.() || 1, 2.0);

          focusNode(n.id, targetZoom, 450);
        }}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const x = node.x ?? 0;
          const y = node.y ?? 0;
          const r = 10;

          ctx.beginPath();
          ctx.fillStyle = nodeColor(node, highlightedId);
          ctx.arc(x, y, r, 0, 2 * Math.PI);
          ctx.fill();

          if (selectedId && node.id === selectedId) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.85)";
            ctx.lineWidth = 2;
            ctx.arc(x, y, r + 4, 0, 2 * Math.PI);
            ctx.stroke();
          }

          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px system-ui`;
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(node.label, x + 14, y + 4);
        }}
      />

      <div className="absolute right-3 top-3 flex gap-2">
        <button
          onClick={zoomIn}
          className="h-9 w-9 rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="h-9 w-9 rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white/15"
        >
          −
        </button>
        <button
          onClick={reset}
          className="h-9 rounded-xl border border-white/15 bg-white/10 px-3 text-sm text-white/80 hover:bg-white/15"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
