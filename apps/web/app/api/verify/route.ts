import { prisma } from "@/lib/db";
import { runVerificationPipeline } from "@/lib/verification";
import { VerifyRequestSchema } from "@verdikt/shared";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VerifyRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const job = await prisma.verificationJob.create({
      data: {
        clientAgentId: data.clientAgentId,
        providerAgentId: data.providerAgentId,
        title: data.title,
        taskSpec: data.taskSpec,
        rubricJson: JSON.stringify(data.rubric),
        deliverableText: data.deliverableText,
        deliverableUrl: data.deliverableUrl,
        status: "submitted",
      },
    });

    if (data.runVerification) {
      await runVerificationPipeline(job.id);
    }

    const full = await prisma.verificationJob.findUnique({
      where: { id: job.id },
      include: { verdict: true, clientAgent: true, providerAgent: true },
    });

    return NextResponse.json({ jobId: job.id, job: full }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
