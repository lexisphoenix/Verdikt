import type { EnsAgentProfile } from "./ens";
import { mockEnsProfile, resolveEnsProfile } from "./ens";

/** Fallback resolver via ensideas.com (works for many ENS + .locker names). */
export async function resolveEnsViaApi(name: string): Promise<Partial<EnsAgentProfile> | null> {
  try {
    const res = await fetch(`https://api.ensideas.com/ens/resolve/${encodeURIComponent(name)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      address?: string | null;
      name?: string;
      avatar?: string;
      displayName?: string;
    };
    if (!data.address && !data.avatar) return null;
    return {
      ensName: name,
      address: data.address as `0x${string}` | undefined,
      avatar: data.avatar,
    };
  } catch {
    return null;
  }
}

export async function resolveEnsFull(
  name: string,
  rpcUrl?: string,
  appUrl?: string
): Promise<{ profile: EnsAgentProfile; resolved: boolean; source: string }> {
  const onchain = rpcUrl ? await resolveEnsProfile(name, rpcUrl) : await resolveEnsProfile(name);
  if (onchain?.address) {
    return { profile: onchain, resolved: true, source: "onchain" };
  }

  const api = await resolveEnsViaApi(name);
  if (api?.address || api?.avatar) {
    const base = mockEnsProfile(name);
    return {
      profile: {
        ...base,
        ...api,
        ensName: name,
        address: api.address ?? base.address,
        agentContext: onchain?.agentContext ?? base.agentContext,
        endpointHttps: appUrl ? `${appUrl}/api/verify` : base.endpointHttps,
        url: appUrl ?? base.url,
      },
      resolved: Boolean(api.address),
      source: api.address ? "ensideas+partial" : "ensideas-metadata",
    };
  }

  if (onchain) {
    return { profile: onchain, resolved: false, source: "onchain-partial" };
  }

  const mock = mockEnsProfile(name);
  if (appUrl) {
    mock.endpointHttps = `${appUrl}/api/verify`;
    mock.url = appUrl;
  }
  return { profile: mock, resolved: false, source: "mock" };
}
