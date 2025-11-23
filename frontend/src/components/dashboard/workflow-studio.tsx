"use client";

import {
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  MarkerType,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { MouseEvent } from "react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { WorkflowNode } from "./workflow-node";
import {
  withParsedGraph,
  type WorkflowWithGraph,
  type WorkflowGraphNode,
  workflowStatuses,
  helloWorldGraph,
} from "@/lib/workflows";
import { ChevronRight, Play, Plus, Save } from "lucide-react";

type WorkflowStudioProps = {
  workflows: WorkflowWithGraph[];
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

const formatStatusLabel = (status: string) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export const WorkflowStudio = ({ workflows }: WorkflowStudioProps) => {
  const [items, setItems] = useState<WorkflowWithGraph[]>(workflows);
  const [activeWorkflowId, setActiveWorkflowId] = useState(
    workflows[0]?.id ?? null,
  );
  const activeWorkflow =
    items.find((wf) => wf.id === activeWorkflowId) ?? items[0] ?? null;

  const [nodes, setNodes, onNodesChange] = useNodesState(
    activeWorkflow?.graph.nodes ?? helloWorldGraph.nodes,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    activeWorkflow?.graph.edges ?? helloWorldGraph.edges,
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    setNodes(activeWorkflow?.graph.nodes ?? helloWorldGraph.nodes);
    setEdges(activeWorkflow?.graph.edges ?? helloWorldGraph.edges);
    setSelectedNodeId(null);
  }, [activeWorkflow?.id, setEdges, setNodes]);

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "smoothstep",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#38bdf8",
            },
            style: { stroke: "#38bdf8" },
          },
          eds,
        ),
      );
    },
    [setEdges],
  );

  const handleAddNode = () => {
    const newNode: WorkflowGraphNode = {
      id: `node-${Date.now()}`,
      type: "workflowNode",
      position: { x: Math.random() * 200, y: Math.random() * 200 },
      data: {
        label: `Step ${nodes.length + 1}`,
        description: "Describe the action this step performs",
        category: "Action",
        accent: "from-emerald-400 to-blue-500",
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  const handleNodeClick = useCallback(
    (_event: MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [],
  );

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId),
    [nodes, selectedNodeId],
  );

  const updateSelectedNode = (field: "label" | "description" | "category") => {
    return (value: string) => {
      if (!selectedNodeId) return;
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  [field]: value,
                },
              }
            : node,
        ),
      );
    };
  };

  const removeSelectedNode = () => {
    if (!selectedNodeId) return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId,
      ),
    );
    setSelectedNodeId(null);
  };

  const handleSave = async () => {
    if (!activeWorkflow) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/workflows/${activeWorkflow.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: activeWorkflow.name,
          description: activeWorkflow.description,
          status: activeWorkflow.status,
          graph: {
            nodes,
            edges,
          },
          inngest_trigger: activeWorkflow.inngest_trigger,
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload.error ?? "Failed to save workflow");
        return;
      }

      const updated = withParsedGraph(payload.workflow);
      setItems((prev) =>
        prev.map((wf) => (wf.id === updated.id ? updated : wf)),
      );
      toast.success("Workflow saved");
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error while saving workflow");
    } finally {
      setSaving(false);
    }
  };

  const handleRun = async () => {
    if (!activeWorkflow) return;
    setRunning(true);
    try {
      const response = await fetch("/api/workflows/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trigger: activeWorkflow.inngest_trigger ?? "api/hello.world",
        }),
      });

      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload.error ?? "Failed to run workflow");
        return;
      }

      toast.success("Workflow kicked off in the engine " + activeWorkflow.inngest_trigger);
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error while running workflow");
    } finally {
      setRunning(false);
    }
  };

  const handleCreateWorkflow = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/workflows", { method: "POST" });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error ?? "Failed to create workflow");
        return;
      }

      const created = withParsedGraph(payload.workflow);
      setItems((prev) => prev.concat(created));
      setActiveWorkflowId(created.id);
      toast.success("Workflow created");
    } catch (error) {
      console.error(error);
      toast.error("Unexpected error while creating workflow");
    } finally {
      setCreating(false);
    }
  };

  const updateActiveWorkflow = <K extends keyof WorkflowWithGraph>(
    field: K,
    value: WorkflowWithGraph[K],
  ) => {
    if (!activeWorkflow) return;
    setItems((prev) =>
      prev.map((wf) => (wf.id === activeWorkflow.id ? { ...wf, [field]: value } : wf)),
    );
  };

  if (!activeWorkflow) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-white/70">
        <p>No workflows yet. Create your first workflow to get started.</p>
        <Button className="mt-4" onClick={handleCreateWorkflow} disabled={creating}>
          <Plus className="mr-2 h-4 w-4" />
          Create workflow
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      <aside className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-slate-400">
              Current flows
            </p>
            <h2 className="text-xl font-semibold text-white">Workspace</h2>
          </div>
          <Button size="sm" variant="ghost" onClick={handleCreateWorkflow} disabled={creating}>
            <Plus className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
        <div className="space-y-3">
          {items.map((workflow) => (
            <button
              key={workflow.id}
              onClick={() => setActiveWorkflowId(workflow.id)}
              className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                workflow.id === activeWorkflow.id
                  ? "border-cyan-400/60 bg-cyan-400/10 shadow-lg shadow-cyan-500/10"
                  : "border-white/5 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>{workflow.name}</span>
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  {workflow.status}
                </span>
              </div>
              {workflow.description ? (
                <p className="text-xs text-slate-400">{workflow.description}</p>
              ) : null}
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
          <p className="text-sm text-slate-300">
            Trigger registered in Go engine:
          </p>
          <p className="font-mono text-sm text-cyan-200">
            {activeWorkflow.inngest_trigger ?? "api/hello.world"}
          </p>
          <Button
            className="mt-4 w-full"
            onClick={handleRun}
            disabled={running}
          >
            <Play className="mr-2 h-4 w-4" />
            {running ? "Running..." : "Run in engine"}
          </Button>
        </div>
      </aside>

      <div className="space-y-5">
        <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Button size="sm" variant="ghost" onClick={handleAddNode}>
              <Plus className="mr-2 h-4 w-4" />
              Add node
            </Button>
            <Button size="sm" variant="ghost" onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button size="sm" onClick={handleRun} disabled={running}>
              <Play className="mr-2 h-4 w-4" />
              {running ? "Running..." : "Run"}
            </Button>
          </div>
          <div className="h-[520px] rounded-2xl border border-white/5 bg-slate-900/40">
            <ReactFlow
              nodes={nodes}
              edges={edges as Edge[]}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={handleConnect}
              nodeTypes={nodeTypes}
              onNodeClick={handleNodeClick}
              fitView
              fitViewOptions={{ padding: 0.2 }}
            >
              <MiniMap
                pannable
                zoomable
                nodeStrokeColor="#38bdf8"
                nodeColor="#0f172a"
              />
              <Controls />
              <Background gap={20} color="#1e293b" />
              <Panel position="top-right" className="rounded-2xl bg-slate-950/80 p-3 text-xs text-slate-300">
                Drag nodes, connect edges, and describe each step like you would in n8n.
              </Panel>
            </ReactFlow>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">Workflow details</h3>
            <div className="mt-4 space-y-4">
              <label className="text-sm text-slate-300">
                Name
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  value={activeWorkflow.name}
                  onChange={(event) =>
                    updateActiveWorkflow("name", event.target.value)
                  }
                />
              </label>
              <label className="text-sm text-slate-300">
                Description
                <textarea
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  rows={3}
                  value={activeWorkflow.description ?? ""}
                  onChange={(event) =>
                    updateActiveWorkflow("description", event.target.value)
                  }
                />
              </label>
              <label className="text-sm text-slate-300">
                Status
                <select
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                  value={activeWorkflow.status}
                  onChange={(event) =>
                    updateActiveWorkflow(
                      "status",
                      event.target.value as WorkflowWithGraph["status"],
                    )
                  }
                >
                  {workflowStatuses.map((status) => (
                    <option key={status} value={status}>
                      {formatStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm text-slate-300">
                Inngest trigger
                <input
                  className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 font-mono text-xs text-cyan-200"
                  value={activeWorkflow.inngest_trigger ?? ""}
                  onChange={(event) =>
                    updateActiveWorkflow("inngest_trigger", event.target.value)
                  }
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Node inspector</h3>
              {selectedNode ? (
                <button
                  className="text-sm text-rose-300"
                  onClick={removeSelectedNode}
                >
                  Remove
                </button>
              ) : null}
            </div>
            {selectedNode ? (
              <div className="mt-4 space-y-4">
                <label className="text-sm text-slate-300">
                  Label
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    value={selectedNode.data.label}
                    onChange={(event) =>
                      updateSelectedNode("label")(event.target.value)
                    }
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Description
                  <textarea
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    rows={3}
                    value={selectedNode.data.description ?? ""}
                    onChange={(event) =>
                      updateSelectedNode("description")(event.target.value)
                    }
                  />
                </label>
                <label className="text-sm text-slate-300">
                  Category
                  <input
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-white"
                    value={selectedNode.data.category ?? ""}
                    onChange={(event) =>
                      updateSelectedNode("category")(event.target.value)
                    }
                  />
                </label>
              </div>
            ) : (
              <div className="mt-6 flex items-center gap-2 rounded-xl border border-dashed border-white/20 p-4 text-sm text-slate-400">
                <ChevronRight className="h-4 w-4" />
                Select a node on the canvas to edit its details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

