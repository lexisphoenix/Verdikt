import { prisma } from "@/lib/db";
import { runVerificationPipeline, triggerPayout } from "@/lib/verification";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await runVerificationPipeline(id);
    const job = await prisma.verificationJob.findUnique({
      where: { id },
      include: { verdict: true },
    });
    return NextResponse.json({ job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const recipientAccountId = body.recipientAccountId as string;
    if (!recipientAccountId) {
      return NextResponse.json(
        { error: "recipientAccountId required" },
        { status: 400 }
      );
    }
    const result = await triggerPayout(id, recipientAccountId);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
