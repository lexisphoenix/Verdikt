import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.agent.updateMany({
    where: { role: "verifier" },
    data: {
      ensName: "stora.locker",
      walletAddress: "0xf931ead57eab855aa11788176d912e4353519743",
      displayName: "Verdikt Verifier (stora.locker)",
      agentContext:
        "Verdikt verification service — TEE-backed judge for agent deliverables",
    },
  });
  console.log("Updated verifier agents:", result.count);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
