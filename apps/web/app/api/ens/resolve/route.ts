import { resolveEnsFull } from "@verdikt/chain";
import { getEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  if (!name) {
    return NextResponse.json({ error: "name query param required" }, { status: 400 });
  }

  const env = getEnv();
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const result = await resolveEnsFull(name, env.RPC_URL, appUrl);

  return NextResponse.json({
    ...result,
    hint:
      !result.resolved && name.endsWith(".locker")
        ? "Add your Ethereum address at https://my.locker — .locker names are ENS-compatible."
        : undefined,
  });
}
