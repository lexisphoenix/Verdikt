import { prisma } from "@/lib/db";
import { submitHumanReview, type ReviewAction } from "@/lib/verification";
import { NextResponse } from "next/server";
import { z } from "zod";

const ReviewSchema = z.object({
  action: z.enum(["approve", "override", "reject"]),
  notes: z.string().optional(),
  pass: z.boolean().optional(),
  score: z.number().min(0).max(100).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const parsed = ReviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { action, notes, pass, score } = parsed.data;
    const result = await submitHumanReview(id, action as ReviewAction, {
      notes,
      pass,
      score,
    });

    const job = await prisma.verificationJob.findUnique({
      where: { id },
      include: { verdict: true },
    });

    return NextResponse.json({ ...result, job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
