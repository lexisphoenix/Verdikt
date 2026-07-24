import { createPublicClient, http, type PublicClient } from "viem";
import { mainnet } from "viem/chains";

export interface EnsAgentProfile {
  ensName: string;
  address?: `0x${string}`;
  agentContext?: string;
  endpointHttps?: string;
  endpointMcp?: string;
  url?: string;
  avatar?: string;
}

const AGENT_TEXT_KEYS = [
  "agent-context",
  "agent-endpoint[https]",
  "agent-endpoint[mcp]",
  "url",
  "description",
] as const;

function getClient(rpcUrl?: string): PublicClient {
  return createPublicClient({
    chain: mainnet,
    transport: http(rpcUrl || "https://cloudflare-eth.com"),
  });
}

export async function resolveEnsProfile(
  ensName: string,
  rpcUrl?: string
): Promise<EnsAgentProfile | null> {
  try {
    const client = getClient(rpcUrl);
    const address = await client.getEnsAddress({ name: ensName });
    if (!address) return null;

    const profile: EnsAgentProfile = { ensName, address };
    for (const key of AGENT_TEXT_KEYS) {
      const value = await client.getEnsText({ name: ensName, key });
      if (!value) continue;
      if (key === "agent-context") profile.agentContext = value;
      if (key === "agent-endpoint[https]") profile.endpointHttps = value;
      if (key === "agent-endpoint[mcp]") profile.endpointMcp = value;
      if (key === "url") profile.url = value;
      if (key === "description" && !profile.agentContext) {
        profile.agentContext = value;
      }
    }
    return profile;
  } catch {
    return null;
  }
}

export function mockEnsProfile(ensName: string): EnsAgentProfile {
  return {
    ensName,
    address: "0x0000000000000000000000000000000000000001",
    agentContext: "Verdikt verification service — TEE-backed agent deliverable judge",
    endpointHttps: "http://localhost:3000/api/verify",
    endpointMcp: "http://localhost:3000/mcp",
    url: "http://localhost:3000",
  };
}
