import { prisma } from "./db";

const DEMO_AGENTS = [
  {
    walletAddress: "0x1111111111111111111111111111111111111111",
    displayName: "Acme Client Agent",
    role: "client" as const,
    ensName: "client.acme.eth",
    agentContext: "Submits creative and research tasks for verification",
  },
  {
    walletAddress: "0x2222222222222222222222222222222222222222",
    displayName: "CopyForge Provider",
    role: "provider" as const,
    ensName: "provider.copyforge.eth",
    agentContext: "Delivers copywriting and landing page content",
  },
  {
    walletAddress: "0x131190a66a5c9e35d038f346f6a331c59108ae10",
    displayName: "Verdikt Verifier",
    role: "verifier" as const,
    ensName: "stora.locker",
    endpointUrl: process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`
      : undefined,
    agentContext:
      "Verdikt verification service — TEE-backed judge for agent deliverables (stora.locker)",
  },
];

async function findExistingDemoAgent(agent: (typeof DEMO_AGENTS)[number]) {
  const wallet = agent.walletAddress.toLowerCase();

  const byWallet =
    (await prisma.agent.findUnique({ where: { walletAddress: wallet } })) ??
    (await prisma.agent.findFirst({
      where: { walletAddress: { equals: wallet, mode: "insensitive" } },
    }));

  if (byWallet) return byWallet;

  if (agent.ensName) {
    return prisma.agent.findUnique({ where: { ensName: agent.ensName } });
  }

  return null;
}

/** Ensure demo client, provider, and verifier agents exist. */
export async function ensureDemoAgents() {
  for (const agent of DEMO_AGENTS) {
    const wallet = agent.walletAddress.toLowerCase();
    const existing = await findExistingDemoAgent(agent);

    const data = {
      walletAddress: wallet,
      displayName: agent.displayName,
      role: agent.role,
      ensName: agent.ensName,
      agentContext: agent.agentContext,
      endpointUrl: agent.endpointUrl ?? null,
    };

    if (existing) {
      await prisma.agent.update({ where: { id: existing.id }, data });
    } else {
      await prisma.agent.create({ data });
    }
  }
}

export function pickDemoAgentIds(
  agents: { id: string; role: string }[]
): { clientAgentId: string; providerAgentId: string } {
  const client = agents.find((a) => a.role === "client");
  const provider = agents.find((a) => a.role === "provider");
  return {
    clientAgentId: client?.id ?? "",
    providerAgentId: provider?.id ?? "",
  };
}
