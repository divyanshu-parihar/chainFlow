import type { Json, Workflow } from "@/supabase/types";
import type { Database, WorkflowStatus } from "@/supabase/types";

export type WorkflowGraphNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description?: string;
    category?: string;
    accent?: string;
  };
};

export type WorkflowGraphEdge = {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
  label?: string;
};

export type WorkflowGraph = {
  nodes: WorkflowGraphNode[];
  edges: WorkflowGraphEdge[];
};

export type WorkflowWithGraph = Workflow & { graph: WorkflowGraph };

const helloWorldNodes: WorkflowGraphNode[] = [
  {
    id: "trigger",
    type: "workflowNode",
    position: { x: -80, y: 0 },
    data: {
      label: "Inngest Event",
      description: "api/hello.world",
      category: "Trigger",
      accent: "from-cyan-400 to-blue-500",
    },
  },
  {
    id: "log-step",
    type: "workflowNode",
    position: { x: 200, y: 0 },
    data: {
      label: "Hello World",
      description: "Writes a log via Go workflow",
      category: "Action",
      accent: "from-fuchsia-400 to-indigo-500",
    },
  },
];

const helloWorldEdges: WorkflowGraphEdge[] = [
  {
    id: "trigger-to-log",
    source: "trigger",
    target: "log-step",
    animated: true,
    label: "Executes",
  },
];

export const helloWorldGraph: WorkflowGraph = {
  nodes: helloWorldNodes,
  edges: helloWorldEdges,
};

const coerceGraph = (graph: Json | null): WorkflowGraph => {
  const fallback = helloWorldGraph;

  if (!graph || typeof graph !== "object") {
    return fallback;
  }

  const parsed = graph as Partial<WorkflowGraph>;
  return {
    nodes: Array.isArray(parsed.nodes) ? (parsed.nodes as WorkflowGraphNode[]) : fallback.nodes,
    edges: Array.isArray(parsed.edges) ? (parsed.edges as WorkflowGraphEdge[]) : fallback.edges,
  };
};

export const withParsedGraph = (workflow: Workflow): WorkflowWithGraph => ({
  ...workflow,
  graph: coerceGraph(workflow.graph),
});

type WorkflowInsert = Database["public"]["Tables"]["workflows"]["Insert"];

export const buildHelloWorldSeed = (userId: string): WorkflowInsert => ({
  user_id: userId,
  name: "Hello World",
  description: "Default workflow registered in the Go engine (api/hello.world).",
  status: "draft",
  graph: helloWorldGraph,
  inngest_trigger: "api/hello.world",
});

export const workflowStatuses: WorkflowStatus[] = ["draft", "active", "archived"];

