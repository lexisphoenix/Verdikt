import { prisma } from "@/lib/db";
import { getEnv, isLiveHedera } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET() {
  const env = getEnv();
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch {
    dbOk = false;
  }

  const jobCount = dbOk
    ? await prisma.verificationJob.count()
    : 0;

  return NextResponse.json({
    status: dbOk ? "ok" : "degraded",
    version: "0.1.0",
    verifierMode: env.VERIFIER_MODE,
    hederaLive: isLiveHedera(),
    database: dbOk ? "connected" : "disconnected",
    jobCount,
    timestamp: new Date().toISOString(),
  });
}
