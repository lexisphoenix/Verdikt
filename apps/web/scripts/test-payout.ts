/** Quick test: real HBAR transfer on Hedera testnet. */
import { readFileSync } from "fs";
import { resolve } from "path";
import { sendHbarPayout } from "@verdikt/chain";

const envPath = resolve(__dirname, "../.env");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  process.env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
}

const accountId = process.env.HEDERA_ACCOUNT_ID!;
const privateKey = process.env.HEDERA_PRIVATE_KEY!;
const recipient = process.argv[2] ?? accountId;
const amount = parseFloat(process.argv[3] ?? "0.01");

sendHbarPayout(
  { accountId, privateKey, network: "testnet" },
  recipient,
  amount
)
  .then((r) => {
    console.log("✓ Real payout:", r.transactionId, r.status, r.amountTinybars, "tinybars");
    console.log("  HashScan: https://hashscan.io/testnet/transaction/" + encodeURIComponent(r.transactionId));
  })
  .catch((e) => console.error("✗", e.message));
