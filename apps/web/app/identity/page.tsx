import { Shell, Card, Badge, Button, HashBlock } from "@/components/ui";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";
import { resolveEnsFull } from "@verdikt/chain";

export const dynamic = "force-dynamic";

const DEFAULT_NAME = "stora.locker";

export default async function IdentityPage({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;
  const name = params.name ?? DEFAULT_NAME;
  const env = getEnv();
  const appUrl = env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { profile, resolved, source } = await resolveEnsFull(name, env.RPC_URL, appUrl);

  const linkedAgent = await prisma.agent.findFirst({
    where: { ensName: name },
  });

  const displayAddress =
    resolved && profile.address
      ? profile.address
      : linkedAgent?.walletAddress ?? profile.address;

  const linkedInApp = Boolean(linkedAgent);
  const linkedInLocker = linkedInApp && !resolved;

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Badge tone="info">ENS · .locker compatible</Badge>
        <h1 className="mt-4 text-3xl font-bold">{name}</h1>
        <p className="mt-2 text-zinc-400">
          Verifier agent identity for this deployment
        </p>

        <Card className="mt-8" glow={resolved || linkedInLocker}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-zinc-500">Resolution</div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge tone={resolved ? "success" : linkedInLocker ? "info" : "warning"}>
                  {resolved
                    ? "On-chain address found"
                    : linkedInLocker
                      ? "Linked in my.locker + Verdikt"
                      : "Metadata only"}
                </Badge>
                <span className="text-xs text-zinc-500">via {source}</span>
              </div>
            </div>
            {profile.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar}
                alt=""
                className="h-16 w-16 rounded-2xl border border-white/10"
              />
            )}
          </div>

          {linkedInLocker && (
            <p className="mt-4 text-sm text-zinc-400">
              Address is saved in my.locker and registered in Verdikt. ENS
              indexers for .locker can take 30–60 minutes to catch up — fine for
              demo if you show my.locker directly.
            </p>
          )}

          <div className="mt-6 grid gap-3">
            <HashBlock
              label="Wallet address"
              value={displayAddress ?? "Not set — link ETH wallet in my.locker"}
            />
            <HashBlock
              label="agent-context"
              value={linkedAgent?.agentContext ?? profile.agentContext}
            />
            <HashBlock label="agent-endpoint[https]" value={profile.endpointHttps} />
            <HashBlock label="url" value={profile.url} />
          </div>
        </Card>

        {!resolved && name.endsWith(".locker") && !linkedInLocker && (
          <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
            <h2 className="font-semibold text-amber-200">Link stora.locker</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
              <li>
                Open{" "}
                <a
                  href="https://my.locker"
                  className="text-indigo-300 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  my.locker
                </a>{" "}
                and sign in
              </li>
              <li>
                Go to <strong>stora.locker</strong> → <strong>Addresses</strong>
              </li>
              <li>
                Connect <strong>MetaMask</strong> and save your Ethereum address
              </li>
              <li>
                (Optional) Text record <code>url</code> →{" "}
                <code className="text-emerald-300">https://verdikt-kohl.vercel.app</code>
              </li>
            </ol>
          </Card>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/api/ens/resolve?name=${encodeURIComponent(name)}`} variant="secondary">
            JSON API
          </Button>
          <Button href="/agents" variant="secondary">
            Agents
          </Button>
          <Button href="/jobs/new">Run verification</Button>
        </div>
      </div>
    </Shell>
  );
}
