# Verdikt

Verification API for agent-delivered work. A client sends a task spec and rubric, a provider sends the deliverable, we judge it with 0G, store the verdict, anchor hashes on Hedera, and optionally pay out on testnet if it passes.

Not a marketplace — just the judge layer other agents can call.

**Live:** https://verdikt-kohl.vercel.app  
**Repo:** https://github.com/lexisphoenix/Verdikt

Built for ETHGlobal (July 2026).

## What it does

1. Register agents (client, provider, verifier) — wallet + optional ENS name
2. `POST /api/verify` with task spec, rubric, deliverable
3. **0G** returns a structured AI verdict (score, pass/fail, per-criterion notes)
4. **Borderline or low-confidence scores** pause for **human review** before anchoring
5. **Final verdict** hashes publish to **Hedera Consensus Service** (HCS)
6. Optional **testnet HBAR payout** after a finalized pass (demo operator account)

The verifier agent is linked to **stora.locker** (see `/identity`).

### Verification pipeline

```
Submit → AI judge (0G) → Human review? → Final verdict → HCS anchor → Optional payout
                              ↓
                    borderline score or confidence < 75%
```

Human review actions: **approve** AI verdict, **override** pass/score, or **reject**. HCS only records the **final** verdict.

### MVP scope

Verdikt judges the **deliverable artifact** against the **task spec + rubric** you send in `POST /api/verify`. It does not fetch repos, diffs, or project files — put any project context in `taskSpec`. In production, the provider agent POSTs its output; the demo form simulates that handoff with pre-filled examples (see `/jobs/new` demo scenarios).

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
| POST | `/api/jobs/:id/review` | Human approve / override / reject (when `pending_review`) |
| PUT | `/api/jobs/:id/verify` | Trigger HBAR payout (after HCS finalized) |
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

## Hedera integration

Verdikt uses the official **`@hashgraph/sdk`** on **Hedera testnet** for audit and demo settlement.

| Service | Usage | Code |
|---------|--------|------|
| **HCS** (Consensus Service) | Publish final verdict audit JSON after AI + optional human review | [`packages/chain/src/hedera.ts`](packages/chain/src/hedera.ts) — `publishAuditMessage()` |
| **Crypto transfer** | Optional score-based HBAR payout (demo operator → provider account) | [`packages/chain/src/hedera.ts`](packages/chain/src/hedera.ts) — `sendHbarPayout()` |
| **Pipeline orchestration** | When to publish HCS; human review gate | [`apps/web/lib/verification.ts`](apps/web/lib/verification.ts) |
| **Review thresholds** | Borderline score / low confidence detection | [`packages/shared/src/review.ts`](packages/shared/src/review.ts) |

### Live testnet artifacts

| Resource | Link |
|----------|------|
| HCS topic `0.0.9728084` | https://hashscan.io/testnet/topic/0.0.9728084 |
| Operator account `0.0.9695296` | https://hashscan.io/testnet/account/0.0.9695296 |
| Health (Hedera live flag) | https://verdikt-kohl.vercel.app/api/health |

Each completed job stores an HCS transaction ID on the job detail page with a **View on HashScan** link.

**Payout note:** The demo sends testnet HBAR from the Verdikt **operator account**, not client escrow. Production would deposit upfront and release on pass; Verdikt’s core value is the **verifiable verdict + HCS proof**.

## Integrations

- **0G** — Router API, live verifier in `packages/verifier`
- **Hedera** — HCS audit + testnet HBAR payout in `packages/chain`
- **ENS** — `.locker` / ENS resolution for verifier identity

## Team

Alexis Phoenix
