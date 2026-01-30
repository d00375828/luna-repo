import { useMemo, useState } from "react";

import type { MindMapGraph, MindMapGraphNode } from "@/data/dev/dashboardData";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";
import {
  edgeLabel,
  getGraphPosition,
  jumpToNode,
} from "@/lib/mindMapGraph";

type MindMapGraphCardProps = {
  graph: MindMapGraph;
};

const nodeTypeStyles: Record<
  MindMapGraphNode["type"],
  { base: string; label: string }
> = {
  file: { base: "bg-sky-50 border-sky-200", label: "File" },
  concept: { base: "bg-purple-50 border-purple-200", label: "Concept" },
  person: { base: "bg-emerald-50 border-emerald-200", label: "Person" },
  task: { base: "bg-amber-50 border-amber-200", label: "Task" },
  commit: { base: "bg-slate-50 border-slate-200", label: "Commit" },
};

const stateGlowClasses = {
  "active-dev": "text-slate-900 shadow-[0_0_20px_rgba(99,102,241,0.25)] animate-pulse",
  "recent-commit": "text-slate-900",
  "failing-tests": "text-slate-900 shadow-[0_0_15px_rgba(248,113,113,0.35)]",
  idle: "text-slate-900",
};

const stateLegend = {
  "active-dev": "Active dev / pulsing",
  "recent-commit": "Recently shipped",
  "failing-tests": "Failing checks",
  idle: "Idle / untouched",
};

const edgeColors = {
  dependency: "#94a3b8",
  import: "#36bffa",
  ownership: "#a855f7",
  "working-on": "#10b981",
  blocks: "#f97316",
};

export function MindMapGraphCard({ graph }: MindMapGraphCardProps) {
  const [zoomLevel, setZoomLevel] = useState<"architecture" | "files">(
    "architecture",
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    graph.nodes[0]?.id ?? null,
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const nodeById = useMemo(() => {
    const map = new Map<string, MindMapGraphNode>();
    graph.nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [graph.nodes]);

  const visibleNodes = useMemo(
    () => graph.nodes.filter((node) => node.layers.includes(zoomLevel)),
    [graph.nodes, zoomLevel],
  );
  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((node) => node.id)),
    [visibleNodes],
  );
  const visibleEdges = useMemo(
    () =>
      graph.edges.filter(
        (edge) =>
          visibleNodeIds.has(edge.from) && visibleNodeIds.has(edge.to),
      ),
    [graph.edges, visibleNodeIds],
  );

  const selectedNode =
    (selectedNodeId && nodeById.get(selectedNodeId)) ?? visibleNodes[0] ?? null;
  const hoveredNode =
    (hoveredNodeId && nodeById.get(hoveredNodeId)) ?? null;

  return (
    <Card id="mind-map">
      <SectionHeader
        eyebrow="Living mind map"
        title="Interactive node graph"
        description="Zoom to architecture or concrete files. Nodes pulse when devs are editing; hover for summaries, click to inspect, double-click to jump."
      >
        <div className="flex items-center gap-2 text-sm">
          {(["architecture", "files"] as const).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setZoomLevel(level)}
              className={`rounded-full border px-3 py-1 capitalize ${
                zoomLevel === level
                  ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                  : "border-slate-300 text-slate-600 hover:border-slate-400"
              }`}
            >
              {level === "architecture" ? "Zoom out" : "Zoom in"}
            </button>
          ))}
        </div>
      </SectionHeader>

      <div className="space-y-4">
        <div className="relative h-[420px] overflow-hidden rounded-2xl border bg-slate-950/5">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
          >
            {visibleEdges.map((edge) => {
              const fromNode = nodeById.get(edge.from);
              const toNode = nodeById.get(edge.to);
              if (!fromNode || !toNode) return null;
              const fromPos = getGraphPosition(fromNode, zoomLevel);
              const toPos = getGraphPosition(toNode, zoomLevel);
              const stroke = edgeColors[edge.type] ?? "#94a3b8";
              return (
                <g key={edge.id}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={toPos.x}
                    y2={toPos.y}
                    stroke={stroke}
                    strokeWidth={1.5}
                    strokeDasharray={
                      edge.type === "blocks" ? "4 3" : undefined
                    }
                    opacity={0.8}
                  />
                  <text
                    x={(fromPos.x + toPos.x) / 2}
                    y={(fromPos.y + toPos.y) / 2 - 1.5}
                    textAnchor="middle"
                    fontSize="2.2"
                    fill={stroke}
                  >
                    {edgeLabel(edge.type)}
                  </text>
                </g>
              );
            })}
          </svg>

          {visibleNodes.map((node) => {
            const pos = getGraphPosition(node, zoomLevel);
            const typeStyle = nodeTypeStyles[node.type];
            const glowClass = stateGlowClasses[node.state];
            return (
              <button
                key={node.id}
                type="button"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border px-3 py-2 text-left text-xs shadow-sm transition ${
                  selectedNode?.id === node.id
                    ? "ring-2 ring-indigo-400"
                    : "hover:ring-2 hover:ring-slate-300"
                } ${typeStyle.base} ${glowClass}`}
                onClick={() => setSelectedNodeId(node.id)}
                onDoubleClick={() => jumpToNode(node.link)}
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId((current) =>
                  current === node.id ? null : current
                )}
              >
                <p className="text-[10px] uppercase tracking-wide text-slate-500">
                  {typeStyle.label}
                </p>
                <p className="font-semibold text-slate-900">{node.label}</p>
              </button>
            );
          })}

          {hoveredNode && (
            <div
              className="pointer-events-none absolute max-w-[220px] rounded-xl border bg-white/95 px-3 py-2 text-xs text-slate-700 shadow-lg"
              style={{
                left: `${getGraphPosition(hoveredNode, zoomLevel).x}%`,
                top: `${getGraphPosition(hoveredNode, zoomLevel).y}%`,
                transform: "translate(-50%, -110%)",
              }}
            >
              {hoveredNode.summary}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {Object.entries(stateLegend).map(([state, label]) => (
            <span
              key={state}
              className={`flex items-center gap-1 rounded-full border px-2 py-1 ${stateGlowClasses[state as keyof typeof stateGlowClasses]}`}
            >
              <span className="h-2 w-2 rounded-full bg-current" />
              {label}
            </span>
          ))}
        </div>

        {selectedNode && (
          <div className="rounded-2xl border bg-white/90 p-4 text-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Focused node
                </p>
                <h4 className="text-lg font-semibold text-slate-900">
                  {selectedNode.label}
                </h4>
              </div>
              <button
                type="button"
                className="rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white"
                onClick={() => jumpToNode(selectedNode.link)}
              >
                Jump to location
              </button>
            </div>
            <p className="mt-2 text-slate-600">{selectedNode.summary}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
