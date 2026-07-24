/**
 * E2E smoke test — run while dev server is up on :3000
 * Usage: npx tsx scripts/e2e-smoke.ts
 */

const BASE = process.env.BASE_URL ?? "http://localhost:3000";

async function main() {
  console.log("E2E smoke test against", BASE);

  const health = await fetch(`${BASE}/api/health`).then((r) => r.json());
  console.log("✓ health", health.status, health.verifierMode);

  const agents = await fetch(`${BASE}/api/agents/register`).then((r) => r.json());
  const client = agents.agents.find((a: { role: string }) => a.role === "client");
  const provider = agents.agents.find((a: { role: string }) => a.role === "provider");
  if (!client || !provider) throw new Error("Missing seeded agents — run db:seed");

  const verifyRes = await fetch(`${BASE}/api/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      clientAgentId: client.id,
      providerAgentId: provider.id,
      title: "E2E smoke test",
      taskSpec: "Write short privacy copy for a VPN.",
      rubric: {
        criteria: [
          { key: "clarity", weight: 50, label: "Clarity" },
          { key: "accuracy", weight: 50, label: "Accuracy" },
        ],
        minimumScore: 60,
      },
      deliverableText:
        "Protect your privacy with encrypted VPN tunnels. No logs, no tracking.",
      runVerification: true,
    }),
  });
  const verify = await verifyRes.json();
  if (!verifyRes.ok) throw new Error(JSON.stringify(verify));
  console.log("✓ verify job", verify.jobId, verify.job?.status);

  const job = await fetch(`${BASE}/api/jobs/${verify.jobId}`).then((r) => r.json());
  if (!job.job?.verdict) throw new Error("No verdict on job");
  console.log("✓ verdict score", job.job.verdict.score, "pass", job.job.verdict.pass);
  console.log("✓ HCS tx", job.job.hcsTransactionId);

  const ens = await fetch(`${BASE}/api/ens/resolve?name=verifier.verdikt.eth`).then((r) =>
    r.json()
  );
  console.log("✓ ENS profile", ens.profile?.agentContext?.slice(0, 40) + "...");

  console.log("\nAll E2E checks passed.");
}

main().catch((e) => {
  console.error("E2E FAILED:", e.message);
  process.exit(1);
});
