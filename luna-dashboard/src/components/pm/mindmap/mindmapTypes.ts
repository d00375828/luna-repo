// components/pm/mindmap/mindmapTypes.ts
// Types local to the mind map feature (keeps lib/pm generic).

export type MindMapNode = {
    id: string;
    label: string;
    kind: "root" | "module" | "file";
    description: string;
    // Optional file path for "file" nodes
    path?: string;
    // Used for zooming into a module's subgraph
    children?: string[];
  };
  
  export type MindMapLink = { source: string; target: string };
  
  export type MindMapData = {
    nodes: MindMapNode[];
    links: MindMapLink[];
  };
  