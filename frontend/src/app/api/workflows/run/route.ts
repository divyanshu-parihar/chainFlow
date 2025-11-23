import { NextResponse } from "next/server";
import { Events, inngest } from "@/app/ingest/client";

const ENGINE_URL =
  process.env.NEXT_PUBLIC_ENGINE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

type RunWorkflowPayload = {
  trigger?: string;
  payload?: Record<string, unknown>;
};

export async function POST(request: Request) {
  // const body = (await request.json().catch(() => ({}))) as RunWorkflowPayload;
  // const trigger = body.trigger?.trim() || "api/hello.world";
  // const payload = body.payload ?? {};

  // const runUrl = `${ENGINE_URL}/api/event`;

  try {

    const run = await inngest.send(
      {
        "name": "api/hello.world",
        "data": {
          "name": "world"
        }
      })
    return NextResponse.json({ run }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reach engine" },
      { status: 500 },
    );
  }
}

