import { prisma } from "@/lib/db";
import { ensureDemoAgents } from "@/lib/demo-agents";
import { getEnv } from "@/lib/env";
import { RegisterAgentSchema } from "@verdikt/shared";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await ensureDemoAgents();
    const agents = await prisma.agent.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ agents });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("GET /api/agents/register failed:", message);
    return NextResponse.json({ error: message, agents: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RegisterAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const agent = await prisma.agent.create({
      data: {
        walletAddress: parsed.data.walletAddress.toLowerCase(),
        displayName: parsed.data.displayName,
        role: parsed.data.role,
        ensName: parsed.data.ensName,
        endpointUrl: parsed.data.endpointUrl,
        agentContext: parsed.data.agentContext,
      },
    });

    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function OPTIONS() {
  getEnv();
  return NextResponse.json({ ok: true });
}
