import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_RUBRIC,
  DEMO_DELIVERABLE,
  DEMO_TASK_SPEC,
} from "@verdikt/shared";

const prisma = new PrismaClient();

async function main() {
  await prisma.verdict.deleteMany();
  await prisma.verificationJob.deleteMany();
  await prisma.agent.deleteMany();

  const client = await prisma.agent.create({
    data: {
      walletAddress: "0x1111111111111111111111111111111111111111",
      displayName: "Acme Client Agent",
      role: "client",
      ensName: "client.acme.eth",
      agentContext: "Submits creative and research tasks for verification",
    },
  });

  const provider = await prisma.agent.create({
    data: {
      walletAddress: "0x2222222222222222222222222222222222222222",
      displayName: "CopyForge Provider",
      role: "provider",
      ensName: "provider.copyforge.eth",
      agentContext: "Delivers copywriting and landing page content",
    },
  });

  const verifier = await prisma.agent.create({
    data: {
      walletAddress: "0x3333333333333333333333333333333333333333",
      displayName: "Verdikt Verifier",
      role: "verifier",
      ensName: "stora.locker",
      endpointUrl: process.env.NEXT_PUBLIC_APP_URL
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`
        : "http://localhost:3000/api/verify",
      agentContext:
        "Verdikt verification service — TEE-backed judge for agent deliverables (stora.locker)",
    },
  });

  console.log("Seeded agents:", { client: client.id, provider: provider.id, verifier: verifier.id });
  console.log("Demo task spec:", DEMO_TASK_SPEC);
  console.log("Demo deliverable:", DEMO_DELIVERABLE.slice(0, 60) + "...");
  console.log("Default rubric criteria:", DEFAULT_RUBRIC.criteria.map((c) => c.key).join(", "));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
