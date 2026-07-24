import { Shell, Card, Badge, Button, HashBlock } from "@/components/ui";
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

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Badge tone="info">ENS · .locker compatible</Badge>
        <h1 className="mt-4 text-3xl font-bold">{name}</h1>
        <p className="mt-2 text-zinc-400">
          Agent identity resolution for Verdikt verifier
        </p>

        <Card className="mt-8" glow={resolved}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-zinc-500">Resolution</div>
              <div className="mt-1 flex items-center gap-2">
                <Badge tone={resolved ? "success" : "warning"}>
                  {resolved ? "On-chain address found" : "Metadata only"}
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

          <div className="mt-6 grid gap-3">
            <HashBlock label="Wallet address" value={profile.address ?? "Not set — link ETH in my.locker"} />
            <HashBlock label="agent-context" value={profile.agentContext} />
            <HashBlock label="agent-endpoint[https]" value={profile.endpointHttps} />
            <HashBlock label="url" value={profile.url} />
          </div>
        </Card>

        {!resolved && name.endsWith(".locker") && (
          <Card className="mt-6 border-amber-500/20 bg-amber-500/5">
            <h2 className="font-semibold text-amber-200">Cómo activar stora.locker</h2>
            <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
              <li>
                Entra en{" "}
                <a href="https://my.locker" className="text-indigo-300 underline" target="_blank" rel="noreferrer">
                  my.locker
                </a>{" "}
                con tu cuenta
              </li>
              <li>Abre <strong>stora.locker</strong> → pestaña <strong>Addresses</strong></li>
              <li>
                Añade tu wallet Ethereum:{" "}
                <code className="text-emerald-300">0xf931ead57eab855aa11788176d912e4353519743</code>
              </li>
              <li>
                (Opcional) Añade text record <code>url</code> con tu URL de Verdikt en producción
              </li>
              <li>Recarga esta página — debe aparecer la address on-chain</li>
            </ol>
          </Card>
        )}

        <div className="mt-6 flex gap-3">
          <Button href={`/api/ens/resolve?name=${encodeURIComponent(name)}`} variant="secondary">
            JSON API
          </Button>
          <Button href="/agents">Ver agents</Button>
        </div>
      </div>
    </Shell>
  );
}
