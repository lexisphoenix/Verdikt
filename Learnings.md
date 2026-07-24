# Learnings — Verdikt Hackathon Build

> Record of discoveries, decisions, and blockers during ETHGlobal hackathon build (24–25 July 2026).

## Day 1 — Bootstrap (24 July)

### Architecture decisions

1. **SQLite over Postgres for hackathon velocity**
   - *Why*: Zero infra setup; Prisma migrates in one command; user may not have Postgres running.
   - *Trade-off*: Production should use Postgres; schema is compatible.

2. **Mock verifier as default (`VERIFIER_MODE=mock`)**
   - *Why*: 0G API key may not be available at first boot; mock heuristic produces realistic structured verdicts for demo.
   - *How*: Weighted rubric scoring on clarity/accuracy/tone keywords — good enough for UI demo and tests.

3. **Monorepo with pnpm workspaces**
   - `packages/shared` — Zod schemas (single source of truth)
   - `packages/verifier` — 0G client + mock/live paths
   - `packages/chain` — Hedera HCS, payout, ENS, hashing
   - `apps/web` — Next.js 15 dashboard + API

4. **Hedera mock when credentials missing**
   - HCS publish and payout return `@mock.*` transaction IDs
   - UI clearly distinguishes mock vs live (HashScan link only for real txs)

### Sponsor research (from `/Proyectos/ETHGlobal`)

| Sponsor | Requirement | Verdikt implementation |
|---------|-------------|------------------------|
| 0G | TEE inference, <3min demo | `packages/verifier` + live mode toggle |
| Hedera | Real testnet payment + HCS | `packages/chain/hedera.ts` |
| ENS | Functional identity, no hardcoded | `/api/ens/resolve` + agent registration |

### DAS orchestration

- Used existing DAS system in `hackathon_winner` as blueprint
- Agent contracts in `das/agents/*.md` map to build phases
- Gates require pytest — adapted to Vitest for TypeScript monorepo

### Testing strategy

- Unit tests: schemas, hashing, mock verifier, mock HCS
- Integration: API routes via `pnpm build` (Next.js typecheck)
- Manual E2E: seed → create job → view verdict → audit panel

### Blockers encountered

1. **pnpm not installed globally** → fixed via `npm install -g pnpm`
2. **create-next-app permission error** → pre-created `apps/` directory
3. **Hedera private key format** → support both `0x` prefixed and raw ECDSA hex

## Pending — needs user action for live testnet

### Hedera testnet setup (you)

1. Go to [HashPack](https://hashpack.app) or [Hedera Portal](https://portal.hedera.com)
2. Create/import testnet account from ETHGlobal faucet tokens
3. Copy **Account ID** (e.g. `0.0.1234567`) and **Private Key** (ECDSA hex)
4. Create HCS topic:
   ```bash
   # Or use Hedera Portal → Consensus → Create Topic
   ```
5. Add to `apps/web/.env`:
   ```env
   HEDERA_ACCOUNT_ID=0.0.YOUR_ID
   HEDERA_PRIVATE_KEY=your_ecdsa_key
   HEDERA_HCS_TOPIC_ID=0.0.YOUR_TOPIC
   VERIFIER_MODE=mock  # or live when 0G key available
   ```
6. Restart `pnpm dev`
7. Create a job → check audit panel for real HashScan link
8. On pass, enter recipient `0.0.xxxxx` and click **Release payout**

### 0G Private Computer (you)

1. Get API key from 0G hacker pack / dashboard
2. Set in `.env`:
   ```env
   VERIFIER_MODE=live
   ZERO_G_API_KEY=...
   ZERO_G_BASE_URL=https://api.0g.ai/v1
   ZERO_G_MODEL=...
   ```

### ENS (optional for booth)

1. Register or use existing ENS name for verifier agent
2. Set text records: `agent-context`, `agent-endpoint[https]`
3. Set `RPC_URL` to Ethereum mainnet RPC
4. Register agent with ENS name in UI → resolve live at `/api/ens/resolve?name=yourname.eth`

## What works without user keys

- ✅ Full UI (landing, dashboard, agents, create job, job detail)
- ✅ Mock verification with structured verdict + per-criterion checks
- ✅ Hash generation (task, deliverable, verdict)
- ✅ Mock HCS audit references
- ✅ Mock payout flow
- ✅ Agent registration
- ✅ All unit tests

## Next improvements (if time permits)

- [ ] MCP wrapper exposing `verify_deliverable` tool
- [ ] Deploy to Vercel with Turso/Postgres
- [ ] Real latency benchmarks (`bench/` from ETHGlobal docs)
- [ ] architecture.png diagram for 0G submission
- [ ] Demo video recording

## Git push log (justification)

| Commit | Rationale |
|--------|-----------|
| `first commit` | Initialize GitHub repo per user instructions |
| `feat: monorepo scaffold` | Phase 0 tickets T-001–T-004 |
| `feat: core packages + API` | Phase 1–2 tickets T-101–T-205 |
| `feat: dashboard UI` | Phase 3 tickets T-301–T-305 |
| `docs: AGENTS + Learnings` | Sponsor submission + team knowledge capture |
