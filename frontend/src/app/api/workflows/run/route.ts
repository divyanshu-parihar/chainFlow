import { NextResponse } from "next/server";

const ENGINE_URL =
  process.env.NEXT_PUBLIC_ENGINE_URL?.replace(/\/$/, "") ||
  "http://localhost:8080";

type RunWorkflowPayload = {
  trigger?: string;
  payload?: Record<string, unknown>;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as RunWorkflowPayload;
  const trigger = body.trigger?.trim() || "api/hello.world";
  const payload = body.payload ?? {};

  const runUrl = `${ENGINE_URL}/api/event`;

  try {
    const response = await fetch(runUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: trigger,
        data: payload,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Engine responded with ${response.status}: ${errorText}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to reach engine" },
      { status: 500 },
    );
  }
}

