#!/usr/bin/env npx tsx
/**
 * One-time setup: create HCS topic + smoke-test Hedera & 0G live integrations.
 * Run from repo root: npx tsx scripts/setup-live.ts
 */

import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvFile(path: string) {
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile(resolve(__dirname, "../apps/web/.env"));

const HEDERA_ACCOUNT_ID = process.env.HEDERA_ACCOUNT_ID!;
const HEDERA_PRIVATE_KEY = process.env.HEDERA_PRIVATE_KEY!;
const ZERO_G_API_KEY = process.env.ZERO_G_API_KEY!;
const ZERO_G_BASE_URL = process.env.ZERO_G_BASE_URL ?? "https://router-api.0g.ai/v1";

async function parseKey(raw: string) {
  const { PrivateKey } = await import("@hashgraph/sdk");
  const key = raw.startsWith("0x") ? raw.slice(2) : raw;
  try {
    return PrivateKey.fromStringECDSA(key);
  } catch {
    return PrivateKey.fromStringED25519(key);
  }
}

async function createHcsTopic(): Promise<string> {
  const { Client, TopicCreateTransaction } = await import("@hashgraph/sdk");
  const client = Client.forTestnet();
  client.setOperator(HEDERA_ACCOUNT_ID, await parseKey(HEDERA_PRIVATE_KEY));

  const tx = await new TopicCreateTransaction()
    .setTopicMemo("Verdikt audit trail — ETHGlobal hackathon")
    .execute(client);
  const receipt = await tx.getReceipt(client);
  const topicId = receipt.topicId!.toString();
  console.log("✓ Created HCS topic:", topicId);
  console.log("  tx:", tx.transactionId.toString());
  return topicId;
}

async function testHcsPublish(topicId: string) {
  const { publishAuditMessage } = await import("../packages/chain/src/hedera");
  const result = await publishAuditMessage(
    {
      accountId: HEDERA_ACCOUNT_ID,
      privateKey: HEDERA_PRIVATE_KEY,
      network: "testnet",
      topicId,
    },
    {
      jobId: "setup-smoke",
      taskSpecHash: "0xtest",
      deliverableHash: "0xtest",
      verdictHash: "0xtest",
      score: 99,
      pass: true,
      recommendedPayoutBps: 10000,
      timestamp: new Date().toISOString(),
    }
  );
  console.log("✓ HCS publish:", result.transactionId, result.status);
  return result;
}

async function test0G() {
  const res = await fetch(`${ZERO_G_BASE_URL}/models`, {
    headers: { Authorization: `Bearer ${ZERO_G_API_KEY}` },
  });
  if (!res.ok) {
    console.log("⚠ 0G /models:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { data?: Array<{ id: string }> };
  const models = data.data?.map((m) => m.id) ?? [];
  console.log("✓ 0G models available:", models.slice(0, 5).join(", "), models.length > 5 ? `+${models.length - 5} more` : "");

  const model = models.find((m) => /gpt-4o-mini|llama|qwen|mistral/i.test(m)) ?? models[0];
  if (!model) return null;

  const chatRes = await fetch(`${ZERO_G_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${ZERO_G_API_KEY}`,
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
    console.log("⚠ 0G chat:", chatRes.status, JSON.stringify(chat).slice(0, 200));
    return null;
  }
  console.log("✓ 0G inference with model:", model);
  console.log("  response:", chat.choices?.[0]?.message?.content?.slice(0, 80));
  return model;
}

async function main() {
  console.log("Verdikt live setup\n");
  if (!HEDERA_ACCOUNT_ID || !HEDERA_PRIVATE_KEY) {
    throw new Error("Missing HEDERA_* in apps/web/.env");
  }

  let topicId = process.env.HEDERA_HCS_TOPIC_ID;
  if (!topicId) {
    topicId = await createHcsTopic();
    console.log("\n→ Add to apps/web/.env:\nHEDERA_HCS_TOPIC_ID=" + topicId);
  } else {
    console.log("Using existing topic:", topicId);
    await testHcsPublish(topicId);
  }

  if (ZERO_G_API_KEY) {
    const model = await test0G();
    if (model) {
      console.log("\n→ Add to apps/web/.env:\nZERO_G_MODEL=" + model);
    }
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error("Setup failed:", e.message ?? e);
  process.exit(1);
});
