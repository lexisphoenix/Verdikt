# Verdikt

**Agentic Verification Service** — a verification layer for agent-delivered work.

Client submits task spec + rubric → provider submits deliverable → TEE-backed verifier (0G) returns structured verdict → audit anchored on Hedera HCS → optional testnet payout → ENS-linked agent identity.

Built for [ETHGlobal](https://ethglobal.com) hackathon (deadline: 25 July 2026).

## Quick start

```bash
pnpm install
cp .env.example apps/web/.env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

```
Client Agent ──┐
               ├──► POST /api/verify ──► Verifier (0G TEE / mock)
Provider Agent ┘                              │
                                                ▼
                                         Structured Verdict
                                                │
                    ┌───────────────────────────┼───────────────────────────┐
                    ▼                           ▼                           ▼
               SQLite/Prisma              Hedera HCS                   ENS profile
               (jobs, agents)           (audit hashes)              (agent identity)
```

## Modes

| Mode | Env | Use case |
|------|-----|----------|
| `mock` | `VERIFIER_MODE=mock` | Local dev, no API keys |
| `live` | `VERIFIER_MODE=live` + 0G keys | Real TEE inference |
| Hedera live | `HEDERA_*` vars set | Real HCS + payout on testnet |

## Scripts

```bash
pnpm dev          # Start Next.js
pnpm test         # Run all package tests
pnpm build        # Production build
pnpm db:seed      # Seed demo agents
pnpm db:reset     # Reset DB + reseed
```

## Sponsor integrations

- **0G**: Private Computer verifier (`packages/verifier`)
- **Hedera**: HCS audit trail + HBAR payout (`packages/chain`)
- **ENS**: Agent identity resolution (`packages/chain/src/ens.ts`)

## Docs

- [AGENTS.md](./AGENTS.md) — agent roles and DAS orchestration
- [Learnings.md](./Learnings.md) — hackathon discoveries and decisions
- [docs/demo-script.md](./docs/demo-script.md) — live demo narrative

## Team

Alejandro Nieto — Founder / Full-stack

## License

MIT
