"use client";

import { Handle, Position, type NodeProps } from "reactflow";

type WorkflowNodeData = {
  label: string;
  description?: string;
  category?: string;
  accent?: string;
};

export const WorkflowNode = ({ data }: NodeProps<WorkflowNodeData>) => {
  const accentClass = data.accent || "from-slate-600 to-slate-800";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-4 py-3 shadow-[0_20px_45px_rgba(15,23,42,0.45)] backdrop-blur">
      <div className="mb-2 inline-flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        {data.category ?? "Step"}
      </div>
      <div className="rounded-xl bg-gradient-to-r p-[1px]">
        <div className={`rounded-[11px] bg-gradient-to-r ${accentClass} px-4 py-3`}>
          <p className="text-sm font-semibold text-white">{data.label}</p>
          {data.description ? (
            <p className="text-xs text-slate-200/80">{data.description}</p>
          ) : null}
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="!bg-cyan-400/80" />
      <Handle type="source" position={Position.Right} className="!bg-blue-400/80" />
    </div>
  );
};

