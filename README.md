# Verdikt

Verification API for agent-delivered work. A client sends a task spec and rubric, a provider sends the deliverable, we judge it with 0G, store the verdict, anchor hashes on Hedera, and optionally pay out on testnet if it passes.

Not a marketplace — just the judge layer other agents can call.

**Live:** https://verdikt-kohl.vercel.app  
**Repo:** https://github.com/lexisphoenix/Verdikt

Built for ETHGlobal (July 2026).

## What it does

1. Register agents (client, provider, verifier) — wallet + optional ENS name
2. `POST /api/verify` with task spec, rubric, deliverable
3. 0G returns a structured verdict (score, pass/fail, per-criterion notes)
4. Hashes go to Hedera Consensus Service
5. Optional HBAR payout scaled to the score

The verifier agent is linked to **stora.locker** (see `/identity`).

## Run locally

```bash
pnpm install
cp .env.example apps/web/.env   # fill in keys
cd apps/web && npx prisma db push && npx tsx prisma/seed.ts
pnpm dev                          # from repo root, or cd apps/web && npx next dev
```

Open http://localhost:3000

Production uses Neon Postgres. Local dev can point `DATABASE_URL` at the same Neon instance or your own Postgres.

## Environment

Copy `.env.example` to `apps/web/.env`. Minimum for a full demo:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Postgres connection string |
| `VERIFIER_MODE` | `mock` or `live` |
| `ZERO_G_API_KEY` | From [pc.0g.ai](https://pc.0g.ai) |
| `ZERO_G_BASE_URL` | `https://router-api.0g.ai/v1` |
| `ZERO_G_MODEL` | e.g. `qwen3-vl-30b` |
| `HEDERA_ACCOUNT_ID` | Testnet account |
| `HEDERA_PRIVATE_KEY` | ECDSA hex |
| `HEDERA_HCS_TOPIC_ID` | Consensus topic for audit messages |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` or your deploy URL |

First-time Hedera setup:

```bash
cd apps/web && npx tsx scripts/setup-live.ts
```

Creates an HCS topic if missing and smoke-tests 0G + Hedera.

## Testnet addresses (demo)

| | |
|---|---|
| Hedera account | `0.0.9695296` |
| HCS topic | `0.0.9728084` |
| Verifier ENS | `stora.locker` |
| Verifier wallet (MetaMask) | `0x131190A66a5c9E35D038F346F6a331c59108aE10` |

## API

| Method | Path | Notes |
|--------|------|-------|
| GET | `/api/health` | DB + integration status |
| GET/POST | `/api/agents/register` | List / create agents |
| POST | `/api/verify` | Create job, run verification |
| GET | `/api/jobs/:id` | Job + verdict + audit refs |
| PUT | `/api/jobs/:id/verify` | Trigger HBAR payout |
| GET | `/api/ens/resolve?name=` | Resolve ENS / .locker profile |

Example body for `/api/verify`:

```json
{
  "clientAgentId": "...",
  "providerAgentId": "...",
  "title": "Copy review",
  "taskSpec": "Write hero copy for a VPN landing page.",
  "rubric": {
    "criteria": [
      { "key": "clarity", "weight": 40 },
      { "key": "accuracy", "weight": 35 },
      { "key": "tone", "weight": 25 }
    ],
    "minimumScore": 75
  },
  "deliverableText": "...",
  "runVerification": true
}
```

## Repo layout

```
apps/web/          Next.js app + API + UI
packages/shared/   Zod schemas
packages/verifier/ 0G client + judge prompt
packages/chain/    Hedera, ENS, hashing
```

## Scripts

```bash
pnpm dev
pnpm test
pnpm build
pnpm db:seed       # demo agents
```

## Demo

See [docs/demo.md](docs/demo.md) for a short walkthrough script.

## Integrations

- **0G** — Router API, live verifier in `packages/verifier`
- **Hedera** — HCS audit + testnet HBAR payout in `packages/chain`
- **ENS** — `.locker` / ENS resolution for verifier identity

## Team

Alejandro Nieto
