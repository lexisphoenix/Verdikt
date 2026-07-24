import { resolveEnsProfile, mockEnsProfile } from "@verdikt/chain";
import { getEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "name query param required" }, { status: 400 });
  }

  const env = getEnv();
  const profile = env.RPC_URL
    ? await resolveEnsProfile(name, env.RPC_URL)
    : null;

  return NextResponse.json({
    profile: profile ?? mockEnsProfile(name),
    resolved: Boolean(profile),
  });
}
