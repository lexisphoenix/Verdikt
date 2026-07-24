# Verdikt — Agent Roles & Orchestration

This document describes the agents in the Verdikt verification system and how DAS (Deadline Agent System) was used to build it.

## Product agents (runtime)

| Agent | Role | Responsibility |
|-------|------|----------------|
| **Client Agent** | `client` | Submits task specs and weighted rubrics |
| **Provider Agent** | `provider` | Delivers work (copy, code, research) for evaluation |
| **Verifier Agent** | `verifier` | Judges deliverables via 0G TEE (or mock heuristic) |

Each agent is registered in the database with:
- Ethereum wallet address
- Optional ENS name + `agent-context` / `agent-endpoint[https]` metadata
- Role and endpoint URL

### Verifier flow

```
1. POST /api/verify { taskSpec, rubric, deliverable, clientAgentId, providerAgentId }
2. packages/verifier builds judge prompt
3. 0G Private Computer (live) OR mock heuristic scores deliverable
4. Zod validates structured Verdict JSON
5. packages/chain hashes task/deliverable/verdict
6. Hedera HCS publishes compact audit message
7. Dashboard shows verdict + audit panel
8. Optional: PUT /api/jobs/:id/verify { recipientAccountId } triggers HBAR payout
```

## DAS build agents (development)

The project was orchestrated using **DAS** from `/Users/Alejito/Proyectos/hackathon_winner`:

| DAS Agent | Phase | Output for Verdikt |
|-----------|-------|------------------|
| research | Research | ETHGlobal sponsor requirements (0G, Hedera, ENS) |
| design | Design | UI direction: dark glass morphism, gradient accents |
| planning | Planning | Phase 0–8 tickets from implementation-tickets-phases.md |
| architect | Architect | Monorepo structure: apps/web + packages/* |
| coding | Coding | Next.js app, Prisma, API routes, packages |
| qa | QA | Vitest suites in shared/verifier/chain |
| pitch | Pitch | Demo script alignment |
| reviewer | Review | Gate checks before commit |

### Running DAS for future iterations

```bash
cd /Users/Alejito/Proyectos/hackathon_winner
pip install -e .
python -m das run "Extend Verdikt with MCP wrapper" \
  --deadline "12 hours" \
  --doc-url "file:///Users/Alejito/Proyectos/ETHGlobal/verification-service-docs.md" \
  --git-commit
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | App + DB + verifier mode status |
| GET/POST | `/api/agents/register` | List / register agents |
| POST | `/api/verify` | Create job + run verification |
| GET | `/api/jobs/:id` | Job detail with verdict + audit |
| POST | `/api/jobs/:id/verify` | Re-run verification |
| PUT | `/api/jobs/:id/verify` | Trigger Hedera payout |
| GET | `/api/ens/resolve?name=` | Resolve ENS agent profile |

## Environment matrix

| Variable | Required for | Notes |
|----------|--------------|-------|
| `DATABASE_URL` | Always | SQLite locally: `file:./dev.db` |
| `VERIFIER_MODE=mock` | Local demo | No external APIs |
| `ZERO_G_*` | Live verifier | From 0G hacker pack |
| `HEDERA_*` | Live HCS/payout | From ethglobal.com/faucet |
| `RPC_URL` | Live ENS | Ethereum mainnet RPC |

## Commit convention

Each meaningful push includes:
- What changed (feature/fix)
- Why (sponsor requirement, demo blocker, etc.)
- Which agent/phase drove the decision when applicable

Example: `feat(verifier): add mock heuristic for offline demo — unblocks QA without 0G key`
