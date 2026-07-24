/**
 * Live integration setup — create HCS topic, test Hedera + 0G.
 * Run: cd apps/web && npx tsx scripts/setup-live.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { publishAuditMessage, createHcsTopic } from "@verdikt/chain";

function loadEnv() {
  const envPath = resolve(__dirname, "../.env");
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

async function test0G(apiKey: string, baseUrl: string) {
  const res = await fetch(`${baseUrl}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    console.log("⚠ 0G /models:", res.status, (await res.text()).slice(0, 300));
    return null;
  }
  const data = (await res.json()) as { data?: Array<{ id: string }> };
  const models = data.data?.map((m) => m.id) ?? [];
  console.log("✓ 0G models:", models.slice(0, 6).join(", "));

  const model =
    models.find((m) => /gpt-4o-mini|claude-sonnet|deepseek|0gm/i.test(m) && !/vl|vision/i.test(m)) ??
    models.find((m) => !/vl|vision|image/i.test(m)) ??
    models[0];
  if (!model) return null;

  const chatRes = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: 'Return JSON only: {"ok":true}' }],
      response_format: { type: "json_object" },
      max_tokens: 50,
    }),
  });
  const chat = await chatRes.json();
  if (!chatRes.ok) {
    console.log("⚠ 0G chat:", chatRes.status, JSON.stringify(chat).slice(0, 300));
    return null;
  }
  console.log("✓ 0G inference OK with model:", model);
  return model;
}

function patchEnv(key: string, value: string) {
  const envPath = resolve(__dirname, "../.env");
  let text = readFileSync(envPath, "utf8");
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(text)) {
    text = text.replace(re, `${key}=${value}`);
  } else {
    text += `\n${key}=${value}\n`;
  }
  writeFileSync(envPath, text);
  process.env[key] = value;
}

async function main() {
  loadEnv();
  const accountId = process.env.HEDERA_ACCOUNT_ID!;
  const privateKey = process.env.HEDERA_PRIVATE_KEY!;
  const zeroGKey = process.env.ZERO_G_API_KEY!;
  const zeroGBase = process.env.ZERO_G_BASE_URL ?? "https://router-api.0g.ai/v1";
  const hederaConfig = {
    accountId,
    privateKey,
    network: "testnet" as const,
  };

  console.log("Verdikt live setup\n");
  console.log("Hedera account:", accountId);

  let topicId = process.env.HEDERA_HCS_TOPIC_ID?.trim();
  if (!topicId) {
    console.log("Creating HCS topic...");
    topicId = await createHcsTopic(hederaConfig);
    patchEnv("HEDERA_HCS_TOPIC_ID", topicId);
    console.log("✓ Topic created and saved to .env:", topicId);
  } else {
    console.log("Using topic:", topicId);
  }

  const hcs = await publishAuditMessage(
    { ...hederaConfig, topicId },
    {
      jobId: "setup-smoke",
      taskSpecHash: "0xsetup",
      deliverableHash: "0xsetup",
      verdictHash: "0xsetup",
      score: 99,
      pass: true,
      recommendedPayoutBps: 10000,
      timestamp: new Date().toISOString(),
    }
  );
  console.log("✓ HCS publish:", hcs.transactionId);
  console.log(
    "  HashScan: https://hashscan.io/testnet/transaction/" +
      encodeURIComponent(hcs.transactionId)
  );

  if (zeroGKey) {
    const model = await test0G(zeroGKey, zeroGBase);
    if (model && !process.env.ZERO_G_MODEL?.trim()) {
      patchEnv("ZERO_G_MODEL", model);
      console.log("✓ Saved ZERO_G_MODEL to .env:", model);
    }
  }

  console.log("\nLive integrations ready. Restart dev server if running.");
}

main().catch((e) => {
  console.error("Setup failed:", e.message ?? e);
  process.exit(1);
});
