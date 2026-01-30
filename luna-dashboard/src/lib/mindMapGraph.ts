import type { MindMapGraphNode } from "@/data/dev/dashboardData";

export type MindMapZoomLevel = "architecture" | "files";

export function getGraphPosition(
  node: MindMapGraphNode,
  zoomLevel: MindMapZoomLevel,
) {
  if (zoomLevel === "files" && node.position.files) {
    return node.position.files;
  }
  return node.position.architecture;
}

export function edgeLabel(type: "import" | "dependency" | "ownership" | "working-on" | "blocks") {
  switch (type) {
    case "import":
      return "imports";
    case "dependency":
      return "depends";
    case "ownership":
      return "owns";
    case "working-on":
      return "working on";
    case "blocks":
      return "blocks";
    default:
      return type;
  }
}

export function jumpToNode(link?: string) {
  if (!link || typeof window === "undefined") return;
  if (link.startsWith("http")) {
    window.open(link, "_blank", "noopener,noreferrer");
  } else {
    window.location.href = link;
  }
}
